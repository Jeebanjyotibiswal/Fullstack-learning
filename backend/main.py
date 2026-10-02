from schemas.user import User
from models.user import Usermodel
from database import Base, engine, get_db
from fastapi import FastAPI,Depends,HTTPException
from sqlalchemy.orm import Session

app=FastAPI()

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/users/")
def create_user(user:User,db:Session=Depends(get_db)):
  exist_user=db.query(Usermodel).filter(Usermodel.username==user.username).first()
  if exist_user:
    raise HTTPException(status_code=400,detail="Username already exists")
  new_user=Usermodel(username=user.username,email=user.email,age=user.age)
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  return {
    "message":"User created successfully",
    "user":new_user
  }

@app.get("/users/")
def get_users(db:Session=Depends(get_db)):
  users=db.query(Usermodel).all()
  return users