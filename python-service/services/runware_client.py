import logging
import os

from runware import IImageBackgroundRemoval, IImageCaption, IImageInference, IImageUpscale, IVideoInference, Runware

logger = logging.getLogger(__name__)

class RunwareClientService:
    def __init__(self):
        self.client = None
        self.connected = False

    async def connect(self):
        """Initialize and connect to Runware"""
        try:
            api_key = os.getenv('RUNWARE_API_KEY')
            if not api_key:
                raise ValueError("RUNWARE_API_KEY environment variable is not set")
            self.client = Runware(api_key=api_key)
            await self.client.connect()
            self.connected = True
            logger.info("Runware client connected successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to Runware: {str(e)}")
            self.connected = False
            return False

    async def ensure_connected(self):
        """Ensure client is connected, connect if needed"""
        if not self.connected or not self.client:
            success = await self.connect()
            if not success or not self.client:
                raise RuntimeError("Failed to establish connection to Runware")

    async def generate_image(self, prompt, model="runware:101@1", width=1024, height=1024, steps=20, cfg_scale=7):
        """Generate image using Runware API"""
        await self.ensure_connected()
        assert self.client is not None

        request_obj = IImageInference(
            positivePrompt=prompt,
            model=model,
            width=width,
            height=height,
            numberResults=1,
            steps=steps,
            CFGScale=cfg_scale
        )

        images = await self.client.imageInference(requestImage=request_obj)
        return images

    async def generate_video(self, prompt, model="klingai:5@3", duration=10, width=1920, height=1080):
        """Generate video using Runware API"""
        await self.ensure_connected()

        request_obj = IVideoInference(
            positivePrompt=prompt,
            model=model,
            duration=duration,
            width=width,
            height=height,
            numberResults=1,
            includeCost=True,
            seed=42
        )

        assert self.client is not None
        videos = await self.client.videoInference(requestVideo=request_obj)
        return videos

    async def remove_background(self, image_data):
        """Remove background from image"""
        await self.ensure_connected()

        request_obj = IImageBackgroundRemoval(
            inputImage=image_data
        )

        assert self.client is not None
        results = await self.client.imageBackgroundRemoval(removeImageBackgroundPayload=request_obj)
        return results

    async def upscale_image(self, image_data, scale_factor=2):
        """Upscale image"""
        await self.ensure_connected()

        request_obj = IImageUpscale(
            inputImage=image_data,
            upscaleFactor=scale_factor
        )

        assert self.client is not None
        results = await self.client.imageUpscale(upscaleGanPayload=request_obj)
        return results

    async def caption_image(self, image_data):
        """Generate caption for image"""
        await self.ensure_connected()

        request_obj = IImageCaption(
            inputImage=image_data
        )

        assert self.client is not None
        result = await self.client.imageCaption(requestImageToText=request_obj)
        return result

    async def test_connection(self):
        """Test connection with a simple generation"""
        await self.ensure_connected()

        test_request = IImageInference(
            positivePrompt="test connection",
            model="runware:101@1",
            width=512,
            height=512,
            numberResults=1
        )

        assert self.client is not None
        images = await self.client.imageInference(requestImage=test_request)
        return images

# Global instance
runware_service = RunwareClientService()