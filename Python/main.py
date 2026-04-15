from fastapi import FastAPI, WebSocket,Path
import uvicorn
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import  datetime
from dotenv import load_dotenv # type: ignore
from grock_model_api import ats_router

load_dotenv()           #config env file

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],   # Allow only backed server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#default routes
@app.get("/")
async def read_root():
    date=datetime.now()
    return JSONResponse(status_code=201,content={"message":f"Hello world :{date}"})


app.include_router(prefix="/api", router=ats_router, tags=["resume_score"])


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)