import asyncio
import logging
import sys
import time
from dotenv import load_dotenv
import os

from aiogram import Bot, Dispatcher, html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

load_dotenv()
   
TOKEN = os.getenv('TOKEN')
CHANNEL_ID = os.getenv('CHANNEL_ID')

bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

dp = Dispatcher()


@dp.message(Command("start"))
async def command_start_handler(message: Message) -> None:
    markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Оформить заказ",
                    web_app=WebAppInfo(url=f"https://овощиоптом39.рф"),
                )
            ]
        ]
    )
    await message.answer(
        "По кнопке ниже вы можете оформить заказ!", reply_markup=markup
    )

@dp.message(Command("history_oders"))
async def command_start_handler(message: Message) -> None:
    markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="История заявок",
                    web_app=WebAppInfo(url=f"https://овощиоптом39.рф/orders"),
                )
            ]
        ]
    )
    await message.answer(
        "Здесь можно глянуть все заявки по дням!", reply_markup=markup
    )

async def send_message_to_channel(message) -> None:
    await bot.send_message(CHANNEL_ID, message)


async def main() -> None:
    # Initialize Bot instance with default bot properties which will be passed to all API calls

    # And the run events dispatching
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
