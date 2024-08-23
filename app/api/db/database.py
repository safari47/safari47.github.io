import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv()

postgres_user=os.getenv('POSTGRES_USER')
postgres_password=os.getenv('POSTGRES_PASSWORD')
postgres_server=os.getenv('POSTGRES_SERVER')
postgres_port=os.getenv('POSTGRES_PORT')
postgres_db=os.getenv('POSTGRES_DB')

connection_string = f'postgresql+psycopg2://{postgres_user}:{postgres_password}@{postgres_server}:{postgres_port}/{postgres_db}'

engine = create_engine(connection_string)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



