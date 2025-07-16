# Categories endpoint for predefined category lists
# PRD: "/api/categories": "GET - Return predefined categories list for dropdowns"

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """
    Return predefined equipment categories for form dropdowns
    PRD: Equipment categories like cameras lenses lighting
    """
    
    # Predefined categories for camera/photography equipment rental business
    categories = {
        "cameras": {
            "name": "Cameras",
            "subcategories": [
                "DSLR Cameras",
                "Mirrorless Cameras", 
                "Cinema Cameras",
                "Action Cameras",
                "Film Cameras",
                "Medium Format Cameras"
            ]
        },
        "lenses": {
            "name": "Lenses",
            "subcategories": [
                "Prime Lenses",
                "Zoom Lenses",
                "Wide Angle Lenses",
                "Telephoto Lenses",
                "Macro Lenses",
                "Cinema Lenses"
            ]
        },
        "lighting": {
            "name": "Lighting",
            "subcategories": [
                "LED Panels",
                "Softboxes",
                "Key Lights",
                "RGB Lights",
                "Studio Strobes",
                "Continuous Lights"
            ]
        },
        "audio": {
            "name": "Audio",
            "subcategories": [
                "Microphones",
                "Audio Recorders",
                "Wireless Systems",
                "Boom Poles",
                "Audio Mixers",
                "Headphones"
            ]
        },
        "support": {
            "name": "Support & Rigs",
            "subcategories": [
                "Tripods",
                "Monopods",
                "Gimbals",
                "Sliders",
                "Shoulder Rigs",
                "Stabilizers"
            ]
        },
        "accessories": {
            "name": "Accessories",
            "subcategories": [
                "Memory Cards",
                "Batteries",
                "Chargers",
                "Filters",
                "Cables",
                "Cases & Bags"
            ]
        }
    }
    
    # Also provide flat list for simple dropdowns
    flat_categories = [category["name"] for category in categories.values()]
    
    # Condition options as specified in PRD
    condition_options = ["new", "good", "fair", "damaged"]
    
    # Status options as specified in PRD
    status_options = ["available", "booked", "maintenance", "retired"]
    
    return jsonify({
        "categories": categories,
        "flat_categories": flat_categories,
        "condition_options": condition_options,
        "status_options": status_options
    })

if __name__ == '__main__':
    app.run(debug=True)