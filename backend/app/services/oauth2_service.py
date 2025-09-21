# backend/app/services/oauth2_service.py

import os
import logging
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

logger = logging.getLogger(__name__)

class OAuth2Service:
    """Google OAuth2 authentication service for Custom Search API"""
    
    def __init__(self):
        # Custom Search API and Indexing API scopes - ONLY ONE DEFINITION!
        self.SCOPES = [
            'https://www.googleapis.com/auth/cse',
            'https://www.googleapis.com/auth/indexing'
        ]

        
        self.client_secret_file = os.getenv('GOOGLE_CLIENT_SECRET_FILE', './client_secret.json')
        self.token_file = os.getenv('GOOGLE_TOKEN_FILE', './token.json')
        
    def get_credentials(self):
        """Get valid OAuth2 credentials, refresh if needed"""
        creds = None
        
        try:
            # Load existing token if it exists
            if os.path.exists(self.token_file):
                creds = Credentials.from_authorized_user_file(self.token_file, self.SCOPES)
                logger.info("Loaded existing OAuth credentials")
                
            # If there are no valid credentials available, get new ones
            if not creds or not creds.valid:
                if creds and creds.expired and creds.refresh_token:
                    logger.info("Refreshing expired OAuth credentials")
                    creds.refresh(Request())
                else:
                    logger.info("Starting OAuth flow - browser will open")
                    flow = InstalledAppFlow.from_client_secrets_file(
                        self.client_secret_file, self.SCOPES)
                    # Run local server for OAuth callback
                    creds = flow.run_local_server(port=0)
                    logger.info("OAuth authentication completed")
                    
                # Save the credentials for the next run
                with open(self.token_file, 'w') as token:
                    token.write(creds.to_json())
                    logger.info(f"OAuth credentials saved to {self.token_file}")
                    
            return creds
            
        except Exception as e:
            logger.error(f"OAuth authentication failed: {str(e)}")
            raise
    
    def get_custom_search_service(self):
        """Get authenticated Custom Search service"""
        try:
            creds = self.get_credentials()
            service = build('customsearch', 'v1', credentials=creds)
            logger.info("Custom Search service initialized with OAuth")
            return service
        except Exception as e:
            logger.error(f"Failed to create Custom Search service: {str(e)}")
            raise

# Global OAuth service instance
oauth2_service = OAuth2Service()
