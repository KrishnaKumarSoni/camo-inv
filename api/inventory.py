# Inventory management endpoints
# PRD: "/api/inventory": "GET/POST - List inventory items with filters, create new inventory items"

from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import firestore
from datetime import datetime
from firebase_admin import firestore
from firebase_config import get_firestore_client, FirestoreCollections

app = Flask(__name__)
CORS(app)

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    """
    Get inventory items with optional filters
    PRD: inventory collection fields: sku_id, serial_number, barcode, condition, status, location, etc.
    """
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({"error": "Database connection failed", "inventory": [], "count": 0}), 500
        
        inventory_ref = db.collection(FirestoreCollections.INVENTORY)
        
        # Apply filters from query parameters
        status_filter = request.args.get('status')
        condition_filter = request.args.get('condition')
        sku_id_filter = request.args.get('sku_id')
        
        query = inventory_ref
        
        if status_filter:
            query = query.where('status', '==', status_filter)
        if condition_filter:
            query = query.where('condition', '==', condition_filter)
        if sku_id_filter:
            query = query.where('sku_id', '==', sku_id_filter)
        
        # Execute query
        docs = query.stream()
        inventory_items = []
        
        for doc in docs:
            item_data = doc.to_dict()
            item_data['id'] = doc.id
            inventory_items.append(item_data)
        
        return jsonify({
            "inventory": inventory_items,
            "count": len(inventory_items)
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch inventory: {str(e)}"}), 500

@app.route('/api/inventory', methods=['POST'])
def create_inventory_item():
    """
    Create new inventory item
    PRD: Save to Firebase Firestore with automatic SKU linking or creation
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        db = get_firestore_client()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
        
        # Validate required fields
        required_fields = ['sku_id', 'condition', 'status']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # PRD inventory collection schema
        inventory_item = {
            "sku_id": data.get('sku_id'),
            "serial_number": data.get('serial_number', ''),
            "barcode": data.get('barcode', ''),
            "condition": data.get('condition'),  # new, good, fair, damaged
            "status": data.get('status', 'available'),  # available, booked, maintenance, retired
            "location": data.get('location', ''),
            "purchase_price": data.get('purchase_price', 0),
            "current_value": data.get('current_value', 0),
            "notes": data.get('notes', ''),
            "created_at": firestore.SERVER_TIMESTAMP,
            "created_by": data.get('created_by', 'system')  # User ID who added the item
        }
        
        # Add to Firestore
        doc_ref = db.collection(FirestoreCollections.INVENTORY).add(inventory_item)
        
        return jsonify({
            "success": True,
            "inventory_id": doc_ref[1].id,
            "message": "Inventory item created successfully"
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to create inventory item: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)