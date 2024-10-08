import asyncio
import logging
import sys
from dotenv import load_dotenv
import os
from aiogram import Bot, Dispatcher, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import Command, CommandStart
from aiogram.types import Message
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.fsm.storage.memory import MemoryStorage

load_dotenv()

TOKEN = os.getenv("TOKEN")
CHANNEL_ID = os.getenv("CHANNEL_ID")
bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher(storage=MemoryStorage())

@dp.message(Command("start"))
async def command_start_handler(message: Message) -> None:
    markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Оформить заказ",
                    web_app=WebAppInfo(url="https://овощиоптом39.рф"),
                )
            ]
        ]
    )
    await message.answer(
        "По кнопке ниже вы можете оформить заказ!", reply_markup=markup
    )

@dp.message(Command("orders"))
async def command_orders_handler(message: Message) -> None:
    markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Посмотреть заявки",
                    web_app=WebAppInfo(url="https://овощиоптом39.рф/orders"),
                )
            ]
        ]
    )
    await message.answer(
        "По кнопке ниже вы можете посмотреть все заявки!", reply_markup=markup
    )


async def send_message_to_channel(message) -> None:
    await bot.send_message(CHANNEL_ID, message)


async def main() -> None:
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
