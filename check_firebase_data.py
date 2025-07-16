#!/usr/bin/env python3
"""
Script to check existing Firebase data structure
"""
import firebase_admin
from firebase_admin import credentials, firestore, auth
import json
import os

def main():
    # Initialize Firebase Admin SDK
    try:
        service_account_path = './camo-inv-firebase-adminsdk-fbsvc-5b5eec8f64.json'
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized successfully")
    except Exception as e:
        print(f"❌ Firebase initialization failed: {e}")
        return

    # Get Firestore client
    db = firestore.client()
    
    print("\n🔍 Checking Firebase Authentication Users...")
    try:
        # List users
        users = auth.list_users()
        print(f"📊 Found {len(users.users)} users:")
        for user in users.users:
            print(f"  - UID: {user.uid}")
            print(f"    Email: {user.email}")
            print(f"    Email Verified: {user.email_verified}")
            print(f"    Created: {user.user_metadata.creation_timestamp}")
            print(f"    Last Sign In: {user.user_metadata.last_sign_in_timestamp}")
            print()
    except Exception as e:
        print(f"❌ Error checking authentication: {e}")
    
    print("\n🔍 Checking Firestore Collections...")
    try:
        # List all collections
        collections = db.collections()
        collection_names = [col.id for col in collections]
        print(f"📊 Found collections: {collection_names}")
        
        # Check each collection
        for collection_name in collection_names:
            print(f"\n📁 Collection: {collection_name}")
            docs = db.collection(collection_name).limit(3).stream()
            
            for doc in docs:
                print(f"  📄 Document ID: {doc.id}")
                data = doc.to_dict()
                print(f"     Data: {json.dumps(data, indent=4, default=str)}")
                print()
                
    except Exception as e:
        print(f"❌ Error checking Firestore: {e}")

if __name__ == "__main__":
    main()