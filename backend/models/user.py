from sqlalchemy import Column, Integer, String
from database import Base
class Usermodel(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String)
    age = Column(Integer)