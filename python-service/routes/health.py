import time
import asyncio
from flask import Blueprint, jsonify
from services.runware_client import runware_service
from services.image_service import ImageService

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'runware-python-service',
        'runware_connected': runware_service.connected,
        'timestamp': time.time()
    })

@health_bp.route('/test-connection', methods=['GET'])
def test_connection():
    """Test Runware API connection"""
    try:
        result = asyncio.run(ImageService.test_connection())
        return jsonify(result)
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@health_bp.route('/models', methods=['GET'])
def get_models():
    """Get available models (static list for demo)"""
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