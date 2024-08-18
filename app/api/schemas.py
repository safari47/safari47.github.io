from typing import Dict
from pydantic import BaseModel, RootModel
from datetime import date


class ProductCart(BaseModel):
    id: int
    name: str
    category: int
    quantity: int
    image: str


class Cart(BaseModel):
    products: Dict[str, ProductCart]  # Словарь продуктов
    date: date
    organization: str
    user_id: str

class DateRequest(BaseModel):
    date: date