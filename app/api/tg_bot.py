import asyncio
import logging
import sys
import time
from dotenv import load_dotenv
import os

from aiogram import Bot, Dispatcher, html, types
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

load_dotenv()

TOKEN = os.getenv("TOKEN")
CHANNEL_ID = os.getenv("CHANNEL_ID")

bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

dp = Dispatcher()


# Обработчик команды /start
@dp.message(Command("start"))
async def command_start_handler(message: types.Message) -> None:
    url = 'https://xn--39-dlcyujbbaj7azf.xn--p1ai/'
    button_text = 'Оформить заказ'
    message_text = 'По кнопке ниже вы можете оформить заказ!'

    # Создайте клавиатуру с web app кнопкой
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text=button_text,
                web_app=WebAppInfo(url=url)
            )
        ]
    ])
    await message.answer(message_text, reply_markup=markup)


# @dp.message(Command("history_orders"))
# async def command_start_handler(message: Message) -> None:
#     markup_order = InlineKeyboardMarkup(
#         inline_keyboard=[
#             [
#                 InlineKeyboardButton(
#                     text="История заявок",
#                     web_app=WebAppInfo(url=f"https://овощиоптом39.рф/orders"),
#                 )
#             ]
#         ]
#     )
#     await message.answer(
#         "Здесь можно глянуть все заявки по дням!", reply_markup=markup_order
#     )


async def send_message_to_channel(message) -> None:
    await bot.send_message(CHANNEL_ID, message)


async def main() -> None:
    # Initialize Bot instance with default bot properties which will be passed to all API calls

    # And the run events dispatching
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
