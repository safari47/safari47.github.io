import asyncio
import logging
import sys
import time
from os import getenv

from aiogram import Bot, Dispatcher, html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

TOKEN = "7428120966:AAG6PRbBJrj1Rfq6sAeeMpkzpr_rLhCTY_I"
CHANNEL_ID = "-1002233519343"

dp = Dispatcher()


@dp.message(Command("start"))
async def command_start_handler(message: Message) -> None:
    markup = InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="Оформить заказ",
                    web_app=WebAppInfo(url=f"https://safari47.github.io"),
                )
            ]
        ]
    )
    await message.answer(
        "По кнопке ниже вы можете оформить заказ!", reply_markup=markup
    )


async def send_message_to_channel(bot: Bot, message) -> None:
    await bot.send_message(CHANNEL_ID, message)


async def main() -> None:
    # Initialize Bot instance with default bot properties which will be passed to all API calls
    bot = Bot(token=TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

    # And the run events dispatching
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
