from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return jsonify({
        "status": "healthy",
        "service": "camorent-inventory-api",
        "message": "API is running on Vercel",
        "path": path
    })

# Vercel handler
def handler(request):
    return app(request.environ, lambda status, headers: None)