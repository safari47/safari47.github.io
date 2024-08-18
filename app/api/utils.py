from app.api.schemas import ProductCart
from typing import Dict
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from app.api.db.database import SessionLocal
from app.api.db.models import Orders,OrderItems,Category,Product
from time import time
from fastapi.responses import JSONResponse
from datetime import datetime

def generate_message(name_organization: str, order_date: str, products: Dict[str, ProductCart], user_id: int, order_datetime: datetime) -> str:
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
                new_order = Orders(CustomerId=user_id, Organization=name_organization, OrderDate=order_datetime, DeliveryDate=order_date)
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



def get_orders(data):
    with SessionLocal() as session:
        try:
            # Ищем заказы по заданной дате
            orders = session.query(Orders).filter(Orders.DeliveryDate == data).all()

            if not orders:
                return JSONResponse(content={"orders": []})  # Возвращаем пустой список, если заказов нет

            result = []
            for order in orders:
                order_data = {
                    "id": order.id,
                    "organizationName": order.Organization,
                    "categories": {}
                }

                for item in order.order_items:
                    product = session.query(Product).filter(Product.id == item.ProductId).first()
                    category = session.query(Category).filter(Category.id == product.category_id).first()

                    # Заполняем товары по категориям
                    if category.name not in order_data['categories']:
                        order_data['categories'][category.name] = []

                    order_data['categories'][category.name].append({
                        "id": product.id,
                        "productName": product.name,
                        "quantity": item.Quantity,
                        "unit": "кг."  # Или другое значение, если у вас есть поле unit
                    })

                result.append(order_data)

            return JSONResponse(content={"orders": result})
        except Exception as e:
            return JSONResponse(content={"error": str(e)}, status_code=500)
