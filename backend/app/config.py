import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SKIP_AUTH: bool = os.getenv("SKIP_AUTH", "true").lower() == "true"
    PORT: int = int(os.getenv("PORT", "8080"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    
settings = Settings()