import logging
import os
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from database import supabase
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Fetch TheCatAPI key from environment variables
THE_CAT_API_KEY = os.getenv("THE_CAT_API_KEY")
CAT_API_URL = "https://api.thecatapi.com/v1/images/search?limit=10"  # Use 100 cats as an example

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.post("/fetch-cats")
async def fetch_cats():
    if not THE_CAT_API_KEY:
        raise HTTPException(status_code=400, detail="THE_CAT_API_KEY is missing in .env")

    try:
        # Make a request to TheCatAPI to fetch random cats
        logger.info(f"Fetching data from TheCatAPI using URL: {CAT_API_URL}")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(CAT_API_URL, headers={"x-api-key": THE_CAT_API_KEY})

            # Log response details for debugging
            logger.info(f"Response status code: {response.status_code}")
            logger.info(f"Response body: {response.text}")

            response.raise_for_status()  # Raise an error for bad status codes
            cats_data = response.json()

            # Process each cat and store in the database
            for cat in cats_data:
                cat_data = {
                    "name": "Unknown",  # You can modify this to fetch from `breeds` if available
                    "breed": "Unknown",  # You can fetch breed name from `breeds` if it exists
                    "category": ', '.join([category["name"] for category in cat.get("categories", [])]),  # Store categories
                    "width": cat.get("width", 0),  # Image width
                    "height": cat.get("height", 0),  # Image height
                    "image_url": cat["url"]
                }

                # Insert into Supabase
                supabase_response = supabase.table("cats").insert(cat_data).execute()

                # Check if the insertion was successful
                if not supabase_response.data:
                    raise HTTPException(status_code=500, detail="Error inserting cat into Supabase")
                
                logger.info(f"Inserted cat into Supabase: {cat_data}")

            return {"message": "10 cats fetched and stored successfully!"}

    except httpx.RequestError as e:
        logger.error(f"Error fetching data from TheCatAPI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching data from TheCatAPI: {str(e)}")
    except httpx.HTTPStatusError as e:
        logger.error(f"TheCatAPI HTTP error: {str(e)}")
        raise HTTPException(status_code=e.response.status_code, detail=f"TheCatAPI error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

class CatCreate(BaseModel):
    name: str
    breed: str
    age: int
    image_url: str
    category: str = None  # Optional
    description: str = None
    isfavorite: bool = False
    width: int = None     # Optional
    height: int = None    # Optional

class CatUpdate(BaseModel):
    name: str = None
    breed: str = None
    age: int = None
    image_url: str = None
    category: str = None  # Optional
    description: str = None
    isfavorite: bool = False
    width: int = None     # Optional
    height: int = None    # Optional

@app.get("/cats")
async def get_cats():
    try:
        # Fetch all cats from Supabase
        response = supabase.table("cats").select("*").execute()

        # Check if the response contains data
        if not response.data:
            raise HTTPException(status_code=500, detail="No cats found in Supabase")
        
        return {"cats": response.data}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching cats: {str(e)}")

@app.post("/cats")
async def add_cat(cat: CatCreate):
    try:
        # Insert new cat into Supabase
        cat_data = cat.dict()
        response = supabase.table("cats").insert(cat_data).execute()

        # Check if the insertion was successful by inspecting response.data
        if not response.data:
            raise HTTPException(status_code=500, detail="Error adding cat to Supabase")
        
        return {"message": "Cat added successfully", "cat": response.data}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding cat: {str(e)}")

@app.get("/cats/{cat_id}")
async def get_cat(cat_id: str):
    try:
        # Fetch a specific cat by ID from Supabase
        response = supabase.table("cats").select("*").eq("id", cat_id).execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Cat not found")
        
        return {"cat": response.data[0]}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching cat: {str(e)}")

@app.put("/cats/{cat_id}")
async def update_cat(cat_id: str, cat: CatUpdate):
    try:
        # Update the cat details by ID in Supabase
        update_data = cat.dict(exclude_unset=True)  # Only update provided fields
        response = supabase.table("cats").update(update_data).eq("id", cat_id).execute()

        # Check if the update was successful
        if not response.data:
            raise HTTPException(status_code=500, detail="Error updating cat in Supabase")
        
        return {"message": "Cat updated successfully", "cat": response.data[0]}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating cat: {str(e)}")

@app.delete("/cats/{cat_id}")
async def delete_cat(cat_id: str):
    try:
        # Delete the cat by ID from Supabase
        response = supabase.table("cats").delete().eq("id", cat_id).execute()

        # Check if the deletion was successful
        if not response.data:
            raise HTTPException(status_code=500, detail="Error deleting cat from Supabase")
        
        return {"message": "Cat deleted successfully"}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting cat: {str(e)}")