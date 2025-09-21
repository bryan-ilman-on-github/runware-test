import asyncio
from flask import Blueprint, request, jsonify
from services.image_service import ImageService

processing_bp = Blueprint('processing', __name__)

@processing_bp.route('/remove-background', methods=['POST'])
def remove_background():
    """Remove background from image using Runware API"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        image_data = data.get('image', '')
        if not image_data:
            return jsonify({'error': 'Image data is required'}), 400

        # Run async background removal
        result = asyncio.run(ImageService.remove_background(image_data))
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@processing_bp.route('/upscale-image', methods=['POST'])
def upscale_image():
    """Upscale image using Runware API"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        image_data = data.get('image', '')
        scale_factor = data.get('scaleFactor', 2)

        if not image_data:
            return jsonify({'error': 'Image data is required'}), 400

        # Run async upscaling
        result = asyncio.run(ImageService.upscale_image(image_data, scale_factor))
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@processing_bp.route('/caption-image', methods=['POST'])
def caption_image():
    """Generate caption for image using Runware API"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        image_data = data.get('image', '')
        if not image_data:
            return jsonify({'error': 'Image data is required'}), 400

        # Run async caption generation
        result = asyncio.run(ImageService.caption_image(image_data))
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500