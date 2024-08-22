from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.router import router as router_api
from app.api.db import models, product_add
from app.api.db.database import engine

app = FastAPI()

# Подключение моделей к базе данных
models.Base.metadata.create_all(bind=engine)

# Инициализация статики
app.mount('/static', StaticFiles(directory='app/static'), name='static')

# Импорт маршрутизатора
app.include_router(router_api)

# Событие старта
@app.on_event("startup")
async def startup_event():
    # Выполнение кода из product_add при запуске
    product_add.initialize_products()

