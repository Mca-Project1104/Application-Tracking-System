from fastapi import APIRouter, status
from dotenv import load_dotenv # type: ignore
from groq import Groq # type: ignore
import os
import json
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel  # Add this import

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)  # Create Groq client
ats_router = APIRouter()

# Load Groq API key
if not GROQ_API_KEY:  # present or not
    raise ValueError("GROQ_API_KEY is missing!")

class ATSRequest(BaseModel):
    resume: str
    JD: str

@ats_router.post("/ats/score")
def model_response(request: ATSRequest) -> dict:  # Change parameter to model, return type to dict
    try:
        combined_text = f"""
        JOB DESCRIPTION:
        {request.JD}

        RESUME:
        {request.resume}
        """ # Extract text from request
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are an ATS (Applicant Tracking System).

                    Your task is to compare a JOB DESCRIPTION and a RESUME.

                    ⚠️ STRICT RULES:
                    - Return ONLY a valid JSON object
                    - Do NOT include markdown (no ``` or ```json)
                    - Do NOT include any explanation or extra text
                    - Do NOT include comments
                    - Output must start with { and end with }
                    - Output must be directly parsable using json.loads()
                    - If you break format, the response is INVALID

                    REQUIRED JSON FORMAT:
                    {
                    "match_score": number,
                    "matched_skills": string[],
                    "missing_skills": string[],
                    "strengths": string[],
                    "weaknesses": string[],
                    "suggestions": string[]
                    }

                    SCORING RULES:
                    - match_score must be between 0 and 100
                    - Base score on skill match, experience, and relevance

                    EXAMPLE OUTPUT:
                    {
                    "match_score": 78,
                    "matched_skills": ["React", "Node.js"],
                    "missing_skills": ["Docker"],
                    "strengths": ["Strong frontend experience"],
                    "weaknesses": ["No DevOps exposure"],
                    "suggestions": ["Learn Docker"]
                    }
                    """
                },
                {
                    "role": "user",
                    "content": combined_text
                }
            ],
            temperature=0.2
        )
        reply = response.choices[0].message.content

        json_reply = json.loads(reply)  # convert into json
        print(json_reply)
        
        return json_reply  # Return the JSON directly; FastAPI will set 200 OK
    
    except Exception as e:
        # Return error as dict; FastAPI will set 500
        return {"error": "server error", "details": str(e)}