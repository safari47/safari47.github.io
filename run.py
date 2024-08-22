import subprocess
import signal
import sys
import os

def run():
    processes = []
    try:
        # Запуск FastAPI приложения
        fastapi_process = subprocess.Popen(
            ["uvicorn", "app.main:app", "--reload"], preexec_fn=os.setsid
        )
        processes.append(fastapi_process)
        
        # Запуск бота
        bot_process = subprocess.Popen(
            [sys.executable, "app/api/tg_bot.py"], preexec_fn=os.setsid
        )
        processes.append(bot_process)
        
        # Ожидаем завершения процессов
        for process in processes:
            process.wait()

    except KeyboardInterrupt:
        for process in processes:
            os.killpg(os.getpgid(process.pid), signal.SIGTERM)

if __name__ == "__main__":
    run()
   
