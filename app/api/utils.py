from app.api.schemas import Product
from typing import Dict
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from app.api.db.database import SessionLocal
from app.api.db.models import Orders,OrderItems
from time import time


def generate_message(name_organization: str, order_date: str, products: Dict[str, Product], user_id: int, order_datetime: datetime) -> str:
    # Создаем два списка продуктов по категориям
    peeled_products = []
    unpeeled_products = []
    for product in products.values():
        if product.category == 1:
            peeled_products.append(f"{product.id}. {product.name} : {product.quantity} кг.")
        elif product.category == 2:
            unpeeled_products.append(f"{product.id}. {product.name} : {product.quantity} кг.")

    # Формируем сообщение
    message_lines = [
        f"Наименование организации: {name_organization}",
        f"Имя пользователя: {user_id}",
        f"Время поступления заявки: {order_datetime}",
        f"Дата поставки заявки: {order_date.strftime("%d-%m-%Y")}",
        "Овощи в заказе:",
    ]

    if peeled_products:
        message_lines.append("____________________")
        message_lines.append("Очищенные:")
        message_lines.extend(peeled_products)

    if unpeeled_products:
        message_lines.append("____________________")
        message_lines.append("Неочищенные:")
        message_lines.extend(unpeeled_products)

    return "\n".join(message_lines)

# Функция для добавления нового заказа с повторными попытками
def add_order(name_organization, order_date, products, user_id, order_datetime, max_retries=3, delay=1):
    retries = 0
    with SessionLocal() as session:
    
        while retries < max_retries:
            try:
                # Начало транзакции
                new_order = Orders(CustomerId=user_id, Organization=name_organization, OrderDate=order_date, DeliveryDate=order_datetime)
                session.add(new_order)
                session.commit()

                # Добавление товаров к новому заказу в рамках той же транзакции
                items = [
                    OrderItems(OrderId=new_order.id, ProductId=product.id, Quantity=product.quantity)
                    for product in products.values()
                ]
                
                session.bulk_save_objects(items)
                session.commit()
                return new_order.id
                # Если все успешно, выходим из цикла
                break
            except IntegrityError:
                # Операция откатится, если произойдет ошибка
                session.rollback()
                retries += 1
                print(f"Attempt {retries} failed, retrying...")
                time.sleep(delay)  # Задержка перед повторной попыткой
            finally:
                session.close()

        if retries == max_retries:
            print("Order could not be processed after several attempts.")
            raise Exception("Maximum retries reached, order was not processed.")


