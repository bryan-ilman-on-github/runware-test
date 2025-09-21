import asyncio
import os
import logging
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import feature availability
try:
    from runware import IVideoInference, IFrameImage, IGoogleProviderSettings
    VIDEO_INFERENCE_AVAILABLE = True
    logger.info("IVideoInference available in current SDK version")
except ImportError:
    VIDEO_INFERENCE_AVAILABLE = False
    logger.info("IVideoInference not available in current SDK version")

try:
    from runware import IImageCaption, IImageToText
    IMAGE_FEATURES_AVAILABLE = True
    logger.info("IImageCaption and IImageToText available")
except ImportError:
    IMAGE_FEATURES_AVAILABLE = False
    logger.info("Image text features not available")

# Import routes
from routes.health import health_bp
from routes.generation import generation_bp
from routes.processing import processing_bp

def create_app():
    """Application factory"""
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(generation_bp)
    app.register_blueprint(processing_bp)

    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    print("Starting Runware Python Service...")
    api_key = os.getenv('RUNWARE_API_KEY')
    print(f"API Key configured: {'YES' if api_key else 'NO'}")

    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    )