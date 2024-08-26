from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from app.api.schemas import Cart, DateRequest, UserId
from app.api.utils import generate_message, add_order, get_orders, get_user_orders
from app.api.db.database import SessionLocal
from app.api.db.models import Product
from datetime import datetime
from app.api.tg_bot import send_message_to_channel

router = APIRouter(prefix="", tags=["API"])
templates = Jinja2Templates(directory="app/template")


@router.get("/")
async def get_main_page(request: Request):
    return templates.TemplateResponse(name="index.html", context={"request": request})


@router.get("/orders")
async def get_orders_page(request: Request):
    return templates.TemplateResponse(
        name="order_history.html", context={"request": request}
    )


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
    user_id = cart.user_id
    order_datetime = (datetime.now()).strftime("%Y-%m-%d %H:%M")
    message = generate_message(
        name_organization, order_date, products
    )
    try:
        succes_order = add_order(
            name_organization, order_date, products, user_id, order_datetime
        )
        await send_message_to_channel(message)
        return {"message": f"{succes_order}"}
    except Exception as e:
        return {"error": str(e)}


@router.post("/api/orders")
async def get_orders_history(data: DateRequest):
    date_obj = data.date.strftime("%Y-%m-%d %H:%M")
    return get_orders(date_obj)


@router.post("/api/user_orders")
async def get_orders_history(user_id: UserId):
    user_id=user_id.user_id
    return get_user_orders(user_id)
