from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from app.api.schemas import Cart,CartItem


router = APIRouter(prefix='', tags=['API'])
templates = Jinja2Templates(directory='app/template')


@router.get('/')
async def get_main_page(request: Request):
    return templates.TemplateResponse(name='index.html', context={'request': request})

@router.post("/api")
async def receive_cart(request: Request):
    # Здесь вы можете выполнять необходимые действия с полученными данными
    print("Received order:", request)
    
    return {"message": "Order received successfully"}