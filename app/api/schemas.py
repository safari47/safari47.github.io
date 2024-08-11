from typing import Dict
from pydantic import BaseModel, RootModel
from datetime import date


class Product(BaseModel):
    quantity: int
    image: str
    category: str
    name: str

class Cart(BaseModel):
    products: Dict[str, Product]  # Словарь продуктов
    date: date
    organization: str
