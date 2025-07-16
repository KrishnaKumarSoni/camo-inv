from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return jsonify({
        "status": "healthy",
        "service": "camorent-inventory-api",
        "message": "Minimal API is running",
        "path": path
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)