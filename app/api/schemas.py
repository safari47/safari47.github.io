from pydantic import BaseModel
from typing import Dict, Any

class CartItem(BaseModel):
    name: str
    quantity: int
    category: str
    image: str

# Определите модель данных для всего запроса корзины
class Cart(BaseModel):
    items: Dict[str, CartItem]