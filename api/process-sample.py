from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/', methods=['POST'])
def process_sample():
    try:
        data = request.get_json()
        sample_text = data.get('sample_text', '')
        
        # Mock processed response for now
        response = {
            "transcript": sample_text,
            "extracted_data": {
                "brand": "Canon",
                "model": "EOS R5", 
                "condition": "excellent",
                "serial_number": "123456789"
            },
            "research_data": {
                "current_price": "₹2,50,000",
                "specifications": "45MP Full Frame"
            },
            "confidence_scores": {
                "brand": 0.95,
                "model": 0.92,
                "condition": 0.88
            },
            "form_data": {
                "name": "Canon EOS R5",
                "brand": "Canon",
                "model": "EOS R5",
                "category": "Camera",
                "condition": "excellent",
                "serial_number": "123456789",
                "purchase_price": 300000,
                "current_value": 250000,
                "location": "Cabinet A, Shelf 2"
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def handler(event, context):
    return app(event, context)