# Firebase Admin SDK configuration for backend operations
# PRD: firebase_auth: "Use Firebase service account JSON for admin SDK initialization"

import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

def initialize_firebase():
    """Initialize Firebase Admin SDK with service account"""
    if not firebase_admin._apps:
        try:
            # Load service account from JSON file
            # PRD: Using camo-inv-firebase-adminsdk-fbsvc-63567b81f3.json
            service_account_path = os.path.join(os.path.dirname(__file__), '..', 'camo-inv-firebase-adminsdk-fbsvc-5b5eec8f64.json')
            
            if os.path.exists(service_account_path):
                print(f"Loading Firebase service account from: {service_account_path}")
                cred = credentials.Certificate(service_account_path)
                firebase_admin.initialize_app(cred)
                print("Firebase Admin SDK initialized successfully")
            else:
                print(f"Service account file not found at: {service_account_path}")
                # Initialize with default credentials for development
                firebase_admin.initialize_app()
        except Exception as e:
            print(f"Firebase initialization error: {e}")
            # For development, you can still proceed without Firebase
            return None
    
    try:
        return firestore.client()
    except Exception as e:
        print(f"Firestore client error: {e}")
        return None

def get_firestore_client():
    """Get Firestore client instance"""
    return initialize_firebase()

# PRD Database Schema Collections
class FirestoreCollections:
    """
    PRD firestore_collections:
    - skus: Equipment types with specifications (including image_url)
    - inventory: Individual inventory items linked to SKUs
    """
    SKUS = 'skus'
    INVENTORY = 'inventory'
    USERS = 'users'