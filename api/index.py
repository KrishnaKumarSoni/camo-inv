from app import app

# This is the entry point for Vercel
def handler(event, context):
    return app