from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
URL="sqlite:///./test.db"
engine=create_engine(url=URL,connect_args={"check_same_thread":False})
sessionLocal=sessionmaker(bind=engine)
base=declarative_base()
def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()