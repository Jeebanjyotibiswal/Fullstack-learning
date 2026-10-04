from fastapi import FastAPI,HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware
from models.user import User
from sqlalchemy.orm import session
from schemas.user import UserSchema
from database import base,get_db,engine
app=FastAPI()
base.metadata.create_all(bind=engine)
cors_origins=["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users")
def create_user(user:UserSchema,db:session=Depends(get_db)):
    exist_username=db.query(User).filter(User.username==user.username).first()
    if exist_username:
        raise HTTPException(
            status_code=400,
            detail="Username is already exist"
        )
    new_user=User(username=user.username,email=user.email,age=user.age)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "mesage":"User registered sucess fully",
        "data":new_user
    }
@app.get("/users")
def get_user(db:session=Depends(get_db)):
    data=db.query(User).all()
    if len(data)==0:
        return {
            "mesasage":"No data in the DB"
        }
    else:
        return{
            "data":data
        }

@app.put("/users/{user_id}")
def update_user(user_id:int,user:UserSchema,db:session=Depends(get_db)):
    user1=db.query(User).filter(user_id==User.id).first()
    if not user1:
        raise HTTPException(
            status_code=400,
            detail="User Id not Found"
        )
    user1.email=user.email
    user1.username=user.username
    user1.age=user.age
    db.commit()
    db.refresh(user1)
    return {
        "mesage":"User Upadted",
        "data":user1
    }
@app.delete("/delete-user/{user_id}")
def delete_user(user_id:int,db:session=Depends(get_db)):
    user1=db.query(User).filter(user_id==User.id).first()
    if not user1:
        raise HTTPException(
            status_code=404,
            detail="User not Found"
        )
    else:
        db.delete(user1)
        db.commit()
    return{
        "message":"User deleted Sucesdfully"
    }
    
