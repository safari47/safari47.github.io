from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from app.api.schemas import Cart
from app.api.utils import generate_message
from app.api.db.database import SessionLocal
from app.api.db.models import Product


router = APIRouter(prefix="", tags=["API"])
templates = Jinja2Templates(directory="app/template")


@router.get("/")
async def get_main_page(request: Request):
    return templates.TemplateResponse(name="index.html", context={"request": request})


@router.get("/api/products")
async def get_products():
    with SessionLocal() as session:
        products = session.query(Product).all()
        return [
            {
                "id": Product.id,
                "name": Product.name,
                "image": Product.image,
                "description": Product.description,
                "category": Product.category_id,
            }
            for Product in products
        ]


@router.post("/api")
async def create_order(cart: Cart):
    # Обработка данных заказа
    products = cart.products
    order_date = cart.date
    name_organization = cart.organization
    print(generate_message(name_organization, order_date, products))

    return {"message": "Успешно"}
