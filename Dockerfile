# Dockerfile for YOLOv8
# официальный базовый образ TensorFlow GPU Jupyter

FROM python:3

# Установка необходимых пакетов и обновление системы
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx && \
    pip install --no-cache-dir -U pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Рабочая директория в контейнере
WORKDIR /app

# Копирование файлов в рабочую директорию
COPY . /app/

# Установка дополнительных зависимостей, указанных в requirements.txt (если они есть)
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Указание команды по умолчанию для выполнения
CMD ["uvicorn", "app.main:app", "--host", "localhost", "--port", "80"]
