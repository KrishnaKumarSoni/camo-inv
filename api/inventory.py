from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://camo-inv.vercel.app', 'http://localhost:3000', 'http://localhost:3001'])

@app.route('/', methods=['GET'])
def get_inventory():
    # Mock inventory data for now
    return jsonify({
        "inventory": [
            {
                "id": "1",
                "name": "Canon EOS R5",
                "brand": "Canon", 
                "model": "EOS R5",
                "serial_number": "CR512034",
                "condition": "excellent",
                "status": "available",
                "location": "Camera Room A2"
            }
        ],
        "count": 1
    })

@app.route('/', methods=['POST'])  
def create_inventory_item():
    return jsonify({"message": "Item created", "id": "new123"})

def handler(event, context):
    return app(event, context)