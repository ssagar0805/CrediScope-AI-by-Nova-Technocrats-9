import json
import os
from typing import Dict, List, Optional
from datetime import datetime

class JSONStorage:
    def __init__(self, storage_dir: str = "storage"):
        self.storage_dir = storage_dir
        os.makedirs(storage_dir, exist_ok=True)
        self.analyses_file = os.path.join(storage_dir, "analyses.json")
        self.results_file = os.path.join(storage_dir, "results.json")
        
        # Initialize files if they don't exist
        for file_path in [self.analyses_file, self.results_file]:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    json.dump({}, f)

    def save_analysis(self, analysis_id: str, data: Dict) -> bool:
        """Save analysis result to JSON storage"""
        try:
            # Load existing data
            with open(self.analyses_file, 'r') as f:
                analyses = json.load(f)
            
            # Add timestamp if not present
            if 'timestamp' not in data:
                data['timestamp'] = datetime.now().isoformat()
            
            # Save analysis
            analyses[analysis_id] = data
            
            # Write back to file
            with open(self.analyses_file, 'w') as f:
                json.dump(analyses, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error saving analysis: {e}")
            return False

    def get_analysis(self, analysis_id: str) -> Optional[Dict]:
        """Retrieve analysis by ID"""
        try:
            with open(self.analyses_file, 'r') as f:
                analyses = json.load(f)
            return analyses.get(analysis_id)
        except Exception as e:
            print(f"Error retrieving analysis: {e}")
            return None

    def get_all_analyses(self, limit: int = 50) -> List[Dict]:
        """Get all analyses with optional limit"""
        try:
            with open(self.analyses_file, 'r') as f:
                analyses = json.load(f)
            
            # Convert to list and sort by timestamp
            analysis_list = list(analyses.values())
            analysis_list.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            
            return analysis_list[:limit]
        except Exception as e:
            print(f"Error retrieving all analyses: {e}")
            return []

# Global storage instance
storage = JSONStorage()