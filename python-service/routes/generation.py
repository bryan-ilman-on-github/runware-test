import asyncio

from flask import Blueprint, jsonify, request
from services.image_service import ImageService

generation_bp = Blueprint('generation', __name__)

@generation_bp.route('/generate/image', methods=['POST'])
def generate_image():
    """Generate image using Runware API"""
    try:
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
        result = asyncio.run(ImageService.generate_image(
            prompt, model, width, height, steps, cfg_scale
        ))

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@generation_bp.route('/generate/video', methods=['POST'])
def generate_video():
    """Generate video using Runware API"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract parameters
        prompt = data.get('prompt', '')
        model = data.get('model', 'klingai:5@3')
        duration = data.get('duration', 10)
        width = data.get('width', 1920)
        height = data.get('height', 1080)
        output_format = data.get('outputFormat', 'mp4')
        output_quality = data.get('outputQuality', 95)

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # Run async generation
        result = asyncio.run(ImageService.generate_video(
            prompt, model, duration, width, height, output_format, output_quality
        ))

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500