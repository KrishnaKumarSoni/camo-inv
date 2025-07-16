# Authentication endpoints for custom user collection
# Aligns with existing Firestore users collection schema

from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import secrets
from firebase_admin import firestore
from firebase_config import get_firestore_client
from datetime import datetime

app = Flask(__name__)
CORS(app)

def hash_password(password: str) -> str:
    """Hash password using SHA-256 to match existing schema"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return hashlib.sha256(password.encode()).hexdigest() == password_hash

@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Login with email and password using custom user collection
    Matches existing schema: email, name, password_hash, created_at
    """
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email and password required"}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        db = get_firestore_client()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
        
        # Query user by email
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).limit(1)
        docs = list(query.stream())
        
        if not docs:
            return jsonify({"error": "Invalid email or password"}), 401
        
        user_doc = docs[0]
        user_data = user_doc.to_dict()
        
        # Verify password
        if not verify_password(password, user_data.get('password_hash', '')):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Generate session token (simplified for demo)
        session_token = secrets.token_urlsafe(32)
        
        # Return user data (excluding password_hash)
        return jsonify({
            "success": True,
            "user": {
                "id": user_doc.id,
                "email": user_data['email'],
                "name": user_data['name'],
                "created_at": user_data['created_at']
            },
            "token": session_token
        })
        
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """
    Create new user account using custom user collection
    Follows existing schema: email, name, password_hash, created_at
    """
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Email and password required"}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        name = data.get('name', email.split('@')[0])  # Default name from email
        
        # Basic validation
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        
        if '@' not in email:
            return jsonify({"error": "Invalid email format"}), 400
        
        db = get_firestore_client()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
        
        # Check if user already exists
        users_ref = db.collection('users')
        existing_query = users_ref.where('email', '==', email).limit(1)
        existing_docs = list(existing_query.stream())
        
        if existing_docs:
            return jsonify({"error": "User with this email already exists"}), 400
        
        # Create new user following existing schema
        user_data = {
            "email": email,
            "name": name,
            "password_hash": hash_password(password),
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        # Add to Firestore
        doc_ref = users_ref.add(user_data)
        
        # Generate session token (simplified for demo)
        session_token = secrets.token_urlsafe(32)
        
        # Return user data (excluding password_hash)
        return jsonify({
            "success": True,
            "user": {
                "id": doc_ref[1].id,
                "email": email,
                "name": name,
                "created_at": user_data['created_at']
            },
            "token": session_token
        })
        
    except Exception as e:
        return jsonify({"error": f"Signup failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)