from app.api.schemas import Product
from typing import Dict

def generate_message(name_organization: str, order_date: str, products: Dict[str, Product]) -> str:
    # Создаем два списка продуктов по категориям
    peeled_products = []
    unpeeled_products = []

    for product in products.values():
        if product.category == "peeled":
            peeled_products.append(f"{product.name} : {product.quantity} кг.")
        elif product.category == "unpeeled":
            unpeeled_products.append(f"{product.name} : {product.quantity} кг.")

    # Формируем сообщение
    message_lines = [
        f"Наименование организации: {name_organization}",
        f"Дата заказа: {order_date}",
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

