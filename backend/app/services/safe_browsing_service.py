# backend/app/services/safe_browsing_service.py

import os
import aiohttp
from typing import Dict, Any

SAFE_BROWSING_API_KEY = os.getenv("SAFE_BROWSING_API_KEY")

async def check_url_safety(url: str) -> Dict[str, Any]:
    """
    Query Google Safe Browsing API to check if a URL is malicious.
    Returns dict with threat info (or empty if safe).
    """
    if not SAFE_BROWSING_API_KEY:
        return {"status": "not_configured"}

    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={SAFE_BROWSING_API_KEY}"
    body = {
        "client": {"clientId": "crediscope", "clientVersion": "1.0"},
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}],
        },
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(endpoint, json=body) as resp:
            return await resp.json()
