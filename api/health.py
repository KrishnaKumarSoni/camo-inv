from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def handler(request):
    """Vercel serverless function handler"""
    return app.response_class(
        response=jsonify({
            "status": "healthy",
            "service": "camorent-inventory-api",
            "endpoints": [
                "/api/process-audio",
                "/api/inventory", 
                "/api/skus",
                "/api/categories",
                "/api/auth/login",
                "/api/auth/signup"
            ]
        }).data,
        status=200,
        mimetype='application/json'
    )