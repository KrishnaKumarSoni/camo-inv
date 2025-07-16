# SKU management endpoints  
# PRD: "/api/skus": "GET/POST - List equipment SKUs, create new SKUs"

from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import firestore
from firebase_config import get_firestore_client, FirestoreCollections

app = Flask(__name__)
CORS(app)

@app.route('/api/skus', methods=['GET'])
def get_skus():
    """
    Get SKUs with optional category filtering
    PRD: skus collection with category grouping
    """
    try:
        db = get_firestore_client()
        if not db:
            return jsonify({"error": "Database connection failed", "skus": [], "count": 0}), 500
        
        skus_ref = db.collection(FirestoreCollections.SKUS)
        
        # Apply filters
        category_filter = request.args.get('category')
        is_active_filter = request.args.get('is_active')
        
        query = skus_ref
        
        if category_filter:
            query = query.where('category', '==', category_filter)
        if is_active_filter is not None:
            is_active = is_active_filter.lower() == 'true'
            query = query.where('is_active', '==', is_active)
        
        # Execute query
        docs = query.stream()
        skus = []
        
        for doc in docs:
            sku_data = doc.to_dict()
            sku_data['id'] = doc.id
            skus.append(sku_data)
        
        # Group by category if requested
        group_by_category = request.args.get('group_by_category', 'false').lower() == 'true'
        
        if group_by_category:
            grouped_skus = {}
            for sku in skus:
                category = sku.get('category', 'uncategorized')
                if category not in grouped_skus:
                    grouped_skus[category] = []
                grouped_skus[category].append(sku)
            
            return jsonify({
                "skus_by_category": grouped_skus,
                "total_count": len(skus)
            })
        
        return jsonify({
            "skus": skus,
            "count": len(skus)
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to fetch SKUs: {str(e)}"}), 500

@app.route('/api/skus', methods=['POST'])
def create_sku():
    """
    Create new SKU or update existing one
    PRD: database_operations: "Save to Firebase Firestore with automatic SKU linking or creation"
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        db = get_firestore_client()
        if not db:
            return jsonify({"error": "Database connection failed"}), 500
        
        # Validate required fields
        required_fields = ['name', 'brand', 'category']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Check if SKU already exists (by brand + model combination)
        existing_sku_query = db.collection(FirestoreCollections.SKUS)\
            .where('brand', '==', data.get('brand'))\
            .where('model', '==', data.get('model', ''))\
            .limit(1)
        
        existing_docs = list(existing_sku_query.stream())
        
        if existing_docs:
            # Return existing SKU ID
            existing_sku = existing_docs[0]
            return jsonify({
                "success": True,
                "sku_id": existing_sku.id,
                "message": "SKU already exists",
                "existing": True
            })
        
        # PRD skus collection schema
        sku_data = {
            "name": data.get('name'),  # Full equipment name like Canon EOS R5
            "brand": data.get('brand'),  # Manufacturer name like Canon Sony Nikon
            "model": data.get('model', ''),  # Model identifier like EOS R5 A7IV
            "category": data.get('category'),  # Equipment category like cameras lenses lighting
            "description": data.get('description', ''),
            "specifications": data.get('specifications', {}),  # JSON object with technical specs
            "price_per_day": data.get('price_per_day', 0),  # Daily rental price in INR
            "security_deposit": data.get('security_deposit', 0),
            "image_url": data.get('image_url', ''),
            "created_at": firestore.SERVER_TIMESTAMP,
            "is_active": data.get('is_active', True)
        }
        
        # Add to Firestore
        doc_ref = db.collection(FirestoreCollections.SKUS).add(sku_data)
        
        return jsonify({
            "success": True,
            "sku_id": doc_ref[1].id,
            "message": "SKU created successfully",
            "existing": False
        })
        
    except Exception as e:
        return jsonify({"error": f"Failed to create SKU: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)