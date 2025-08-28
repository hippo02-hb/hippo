from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
import os
import logging

# Import database and models
from database import create_tables

# Import routers
from routers import movies, cinemas, showtimes, bookings, news, auth, admin

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="Galaxy Cinema API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Galaxy Cinema API is running!"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "galaxy-cinema-api"}

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(admin.router)
api_router.include_router(movies.router)
api_router.include_router(cinemas.router)
api_router.include_router(showtimes.router)
api_router.include_router(bookings.router)
api_router.include_router(news.router)

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    try:
        create_tables()
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Galaxy Cinema API shutting down")