from fastapi import FastAPI,HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware
from models.user import User
from sqlalchemy.orm import session
from schemas.user import UserSchema
from database import base,get_db,engine
from redis_client import redis_client
import json
import hashlib
from langchain_groq import ChatGroq
import httpx
from prometheus_fastapi_instrumentator import Instrumentator
app=FastAPI()
from dotenv import load_dotenv
load_dotenv()
import os
api_key=os.getenv("api_key")
model="openai/gpt-oss-120b"
llm=ChatGroq(api_key=api_key,model=model,temperature=0.7,  max_tokens=1024,
    timeout=None,
    max_retries=2,)
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
# @app.get("/users")
# def get_user(db:session=Depends(get_db)):
#     data=db.query(User).all()
#     if len(data)==0:
#         return {
#             "mesasage":"No data in the DB"
#         }
#     else:
#         return{
#             "data":data
#         }

@app.put("/users/{user_id}")
async def update_user(user_id:int,user:UserSchema,db:session=Depends(get_db)):
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
    # cach invalidation
    cache_key=f"user:{user_id}"
    # await redis_client.delete(cache_key)
    # cache write through
    user_data={
        "id":user1.id,
        "username":user1.username,
        "email":user1.email,
        "age":user1.age
    }
    # update in redis
    await redis_client.set(
        cache_key,
        json.dumps(user_data),
        ex=300
    )

    return {
        "mesage":"User Upadted",
        "data":user_data
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
    

# cache implementation
import json

@app.get("/users/{user_id}")
async def get_user(
    user_id: int,
    db: session = Depends(get_db)
):

    # Step 1: Check Redis
    cache_key = f"user:{user_id}"

    cached_user = await redis_client.get(cache_key)

    if cached_user:
        print("USER FETCHED FROM CACHE")

        return {
            "source": "redis",
            "message": "User fetched from cache",
            "data": json.loads(cached_user)
        }

    # Step 2: Cache miss
    print("CACHE MISS")

    # Step 3: Get user from database
    user1 = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user1:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Step 4: Convert SQLAlchemy object to dictionary
    user_data = {
        "id": user1.id,
        "username": user1.username,
        "email": user1.email,
        "age": user1.age
    }

    # Step 5: Store user in Redis
    await redis_client.set(
        cache_key,
        json.dumps(user_data),
        ex=60
    )

    # Step 6: Return response
    return {
        "source": "database",
        "message": "User fetched from database",
        "data": user_data
    }
    # step 5 return the user data
   
@app.get("/users")
def get_all_users(db:session=Depends(get_db)):
    users=db.query(User).all()
    if not users:
        raise HTTPException(
            status_code=404,
            detail="No Users Found"
        )
    return {
        "message":"Users fetched successfully",
        "data":users
    }

import json
import httpx

@app.get("/weather/bhubaneswar")
async def get_weather():

    cache_key = "weather:bbsr"

    # 1. Check Redis
    cached_weather = await redis_client.get(cache_key)

    if cached_weather:
        print("WEATHER FROM REDIS")

        return {
            "source": "redis",
            "data": json.loads(cached_weather)
        }

    print("CACHE MISS")

    # 2. Call external Weather API
    url = (
        "https://api.open-meteo.com/v1/forecast"
        "?latitude=20.2961"
        "&longitude=85.8245"
        "&current=temperature_2m,"
        "relative_humidity_2m,"
        "apparent_temperature,"
        "weather_code,"
        "wind_speed_10m"
        "&timezone=auto"
    )

    async with httpx.AsyncClient() as client:

        response = await client.get(url)

        response.raise_for_status()

        weather_data = response.json()

    # 3. Store response in Redis
    # TTL = 300 seconds = 5 minutes
    await redis_client.set(
        cache_key,
        json.dumps(weather_data),
        ex=300
    )

    # 4. Return
    return {
        "source": "external_api",
        "data": weather_data
    }

@app.get("/chat/{prompt}")
async def chat_with_llm(prompt: str):

    # 1. Create cache key
    prompt_hash = hashlib.sha256(
        prompt.encode("utf-8")
    ).hexdigest()

    cache_key = f"llm:{prompt_hash}"

    # 2. Check Redis
    cached_response = await redis_client.get(cache_key)

    if cached_response:

        print("🤖 LLM RESPONSE FROM REDIS")

        return {
            "source": "redis",
            "message": "Response from cache",
            "data": cached_response
        }

    print("🔥 CACHE MISS - CALLING GROQ")

    # 3. Call LLM
    response = llm.invoke(prompt)

    llm_response = response.content

    # 4. Store response in Redis
    # TTL = 300 seconds = 5 minutes
    await redis_client.set(
        cache_key,
        llm_response,
        ex=300
    )

    # 5. Return response
    return {
        "source": "groq",
        "message": "Response from LLM",
        "data": llm_response
    }

Instrumentator().instrument(app).expose(app)