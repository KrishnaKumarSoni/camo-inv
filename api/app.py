# Main Flask application combining all API endpoints
# PRD: backend: Python Flask with simple REST API structure

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(__file__))

from process_audio import app as audio_app
from inventory import app as inventory_app  
from skus import app as skus_app
from categories import app as categories_app
from auth import app as auth_app

# Create main Flask app
app = Flask(__name__)
CORS(app)

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
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
    })

# Import and register route handlers
from process_audio import process_audio, process_sample
from inventory import get_inventory, create_inventory_item
from skus import get_skus, create_sku
from categories import get_categories
from auth import login, signup

# Register audio processing routes
app.add_url_rule('/api/process-audio', 'process_audio', process_audio, methods=['POST'])
app.add_url_rule('/api/process-sample', 'process_sample', process_sample, methods=['POST'])

# Register inventory routes  
app.add_url_rule('/api/inventory', 'get_inventory', get_inventory, methods=['GET'])
app.add_url_rule('/api/inventory', 'create_inventory_item', create_inventory_item, methods=['POST'])

# Register SKU routes
app.add_url_rule('/api/skus', 'get_skus', get_skus, methods=['GET'])
app.add_url_rule('/api/skus', 'create_sku', create_sku, methods=['POST'])

# Register categories route
app.add_url_rule('/api/categories', 'get_categories', get_categories, methods=['GET'])

# Register authentication routes
app.add_url_rule('/api/auth/login', 'login', login, methods=['POST'])
app.add_url_rule('/api/auth/signup', 'signup', signup, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True, port=5000)