from app.api.schemas import Product
from typing import Dict
from datetime import datetime

def generate_message(name_organization: str, order_date: str, products: Dict[str, Product], user_id: int) -> str:
    # Создаем два списка продуктов по категориям
    peeled_products = []
    unpeeled_products = []
    order_datetime= (datetime.now()).strftime("%d-%m-%Y %H:%M")
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

