from database import base
from sqlalchemy import Column,Integer,String

class User(base):
    __tablename__="user"
    id=Column(Integer,primary_key=True)
    username=Column(String)
    email=Column(String)
    age=Column(Integer)