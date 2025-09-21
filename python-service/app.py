import asyncio
import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import logging

# Import Runware SDK
from runware import Runware, IImageInference

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global Runware instance
runware_client = None

async def initialize_runware():
    """Initialize Runware client with API key"""
    global runware_client
    try:
        runware_client = Runware(api_key=os.getenv('RUNWARE_API_KEY'))
        await runware_client.connect()
        logger.info("✅ Runware client connected successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to connect to Runware: {str(e)}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'runware-python-service',
        'runware_connected': runware_client is not None,
        'timestamp': time.time()
    })

@app.route('/generate/image', methods=['POST'])
def generate_image():
    """Generate image using Runware API"""
    try:
        # Get request data
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract parameters
        prompt = data.get('prompt', '')
        model = data.get('model', 'runware:101@1')
        width = data.get('width', 1024)
        height = data.get('height', 1024)
        steps = data.get('steps', 20)
        cfg_scale = data.get('cfgScale', 7)

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # Run async generation
        result = asyncio.run(generate_image_async(
            prompt, model, width, height, steps, cfg_scale
        ))

        return jsonify(result)

    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        return jsonify({'error': str(e)}), 500

async def generate_image_async(prompt, model, width, height, steps, cfg_scale):
    """Async function to generate image"""
    try:
        start_time = time.time()

        # Ensure client is connected
        if not runware_client:
            await initialize_runware()

        # Create image inference request
        request_obj = IImageInference(
            positivePrompt=prompt,
            model=model,
            width=width,
            height=height,
            numberResults=1,
            steps=steps,
            CFGScale=cfg_scale
        )

        # Generate image
        images = await runware_client.imageInference(requestImage=request_obj)

        generation_time = time.time() - start_time

        if images and len(images) > 0:
            return {
                'success': True,
                'image': {
                    'url': images[0].imageURL,
                    'uuid': images[0].imageUUID,
                    'prompt': prompt,
                    'model': model,
                    'parameters': {
                        'width': width,
                        'height': height,
                        'steps': steps,
                        'cfgScale': cfg_scale
                    },
                    'generationTime': round(generation_time, 2)
                },
                'metadata': {
                    'timestamp': time.time(),
                    'processingTime': round(generation_time, 2)
                }
            }
        else:
            return {
                'success': False,
                'error': 'No images generated'
            }

    except Exception as e:
        logger.error(f"Async image generation error: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/generate/video', methods=['POST'])
def generate_video():
    """Generate video using Runware API (placeholder for future implementation)"""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # For now, return a placeholder response
        # TODO: Implement actual video generation when available
        return jsonify({
            'success': True,
            'message': 'Video generation will be implemented when Runware video API is fully available',
            'prompt': prompt,
            'status': 'placeholder'
        })

    except Exception as e:
        logger.error(f"Error in video generation endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/models', methods=['GET'])
def get_models():
    """Get available models (static list for demo)"""
    # Popular models for demo
    models = [
        {
            'id': 'runware:101@1',
            'name': 'Runware Default',
            'description': 'High-quality general purpose model'
        },
        {
            'id': 'civitai:102438@133677',
            'name': 'CivitAI Realistic',
            'description': 'Photorealistic image generation'
        },
        {
            'id': 'runware:100@1',
            'name': 'Runware Artistic',
            'description': 'Artistic and creative styles'
        }
    ]

    return jsonify({
        'success': True,
        'models': models
    })

@app.route('/test-connection', methods=['GET'])
def test_connection():
    """Test Runware API connection"""
    try:
        result = asyncio.run(test_runware_connection())
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

async def test_runware_connection():
    """Test connection to Runware API"""
    try:
        if not runware_client:
            success = await initialize_runware()
            if not success:
                return {
                    'success': False,
                    'error': 'Failed to initialize Runware client'
                }

        # Test with a simple generation
        test_request = IImageInference(
            positivePrompt="test connection",
            model="runware:101@1",
            width=512,
            height=512,
            numberResults=1
        )

        start_time = time.time()
        images = await runware_client.imageInference(requestImage=test_request)
        response_time = time.time() - start_time

        return {
            'success': True,
            'connection': 'active',
            'responseTime': round(response_time, 2),
            'testImage': images[0].imageURL if images else None
        }

    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# Initialize Runware on startup will be done on first request

if __name__ == '__main__':
    # Initialize Runware client
    print("Starting Runware Python Service...")
    api_key = os.getenv('RUNWARE_API_KEY')
    print(f"API Key configured: {'YES' if api_key else 'NO'}")

    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('FLASK_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    )