from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def health():
    return jsonify({
        "status": "healthy", 
        "service": "camorent-inventory-api",
        "endpoints": ["/api/process-audio", "/api/inventory", "/api/skus", "/api/categories", "/api/auth"]
    })

def handler(event, context):
    return app(event, context)