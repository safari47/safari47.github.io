from app.api.db.database import  SessionLocal
from app.api.db.models import Category, Product

# Список категорий
categories_data = [
    {"name": "Очищенные овощи"},
    {"name": "Нечищенные овощи"},
]

# Список продуктов
products_data = [
    {"name": "Картофель", "image": "/static/Image/8.png", "description": "", "category": 1},
    {"name": "Черри", "image": "/static/Image/9.png", "description": "", "category": 1},
    {"name": "Дольки", "image": "/static/Image/5.png", "description": "", "category": 1},
    {"name": "Лук красный", "image": "/static/Image/1.png", "description": "", "category": 1},
    {"name": "Свекла", "image": "/static/Image/3.png", "description": "", "category": 1},
    {"name": "Морковь", "image": "/static/Image/4.png", "description": "", "category": 1},
    {"name": "Чеснок", "image": "/static/Image/6.png", "description": "", "category": 1},
    {"name": "Лук репчатый", "image": "/static/Image/7.png", "description": "", "category": 1},
    
    {"name": "Чеснок", "image": "/static/Image/2.png", "description": "", "category": 2},
    {"name": "Картофель", "image": "/static/Image/10.png", "description": "", "category": 2},
    {"name": "Морковь", "image": "/static/Image/11.png", "description": "", "category": 2},
    {"name": "Свекла", "image": "/static/Image/12.png", "description": "", "category": 2},
    {"name": "Лук репчатый", "image": "/static/Image/13.png", "description": "", "category": 2},
    {"name": "Лук красный", "image": "/static/Image/14.png", "description": "", "category": 2},
    {"name": "Капуста", "image": "/static/Image/15.png", "description": "", "category": 2},
]

def initialize_products():
    # Работаем с сессией с использованием контекстного менеджера
    with SessionLocal() as session:
        existing_products = session.query(Product).count()
        if existing_products > 0:
            print("Продукты уже существуют!")
        else:
            # Вставка категорий
            for category_data in categories_data:
                category = Category(**category_data)
                session.add(category)

            # Сразу же сохраняем изменения, чтобы категории появились в БД
            session.commit()

            # Вставка продуктов
            for product_data in products_data:
                product = Product(
                    name=product_data["name"],
                    image=product_data["image"],
                    description=product_data["description"],
                    category_id=product_data["category"]
                )
                session.add(product)
            print("Продукты добавлены!")

        # Завершаем транзакцию
        session.commit()


