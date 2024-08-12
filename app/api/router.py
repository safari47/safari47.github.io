from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from app.api.schemas import Cart
from app.api.utils import generate_message


router = APIRouter(prefix="", tags=["API"])
templates = Jinja2Templates(directory="app/template")


@router.get("/")
async def get_main_page(request: Request):
    return templates.TemplateResponse(name="index.html", context={"request": request})


@router.post("/api")
async def create_order(cart: Cart):
    # Обработка данных заказа
    products = cart.products
    order_date = cart.date
    name_organization = cart.organization
    print(generate_message(name_organization, order_date, products))

    return {"message": "Успешно"}
