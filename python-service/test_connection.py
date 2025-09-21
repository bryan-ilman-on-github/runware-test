#!/usr/bin/env python3
"""
Runware API Connection Test Script
Tests the connection to Runware API independently
"""

import asyncio
import os
import sys
from dotenv import load_dotenv
from runware import Runware, IImageInference

# Load environment variables
load_dotenv()

async def test_runware_connection():
    """Test basic connection to Runware API"""
    print("Testing Runware API connection...")

    api_key = os.getenv('RUNWARE_API_KEY')
    if not api_key:
        print("ERROR: No API key found in environment variables")
        return False

    print(f"Using API key: {api_key[:10]}...")

    try:
        # Initialize Runware client
        runware = Runware(api_key=api_key)
        print("Connecting to Runware...")

        # Connect to the service
        await runware.connect()
        print("SUCCESS: Connected to Runware!")

        # Test with a simple image generation
        print("Testing image generation...")

        request = IImageInference(
            positivePrompt="a beautiful sunset over mountains",
            model="runware:101@1",
            width=512,
            height=512,
            numberResults=1
        )

        import time
        start_time = time.time()

        images = await runware.imageInference(requestImage=request)

        generation_time = time.time() - start_time

        if images and len(images) > 0:
            print(f"SUCCESS: Image generated!")
            print(f"Generation time: {generation_time:.2f} seconds")
            print(f"Image URL: {images[0].imageURL}")
            print(f"Image UUID: {images[0].imageUUID}")
            return True
        else:
            print("ERROR: No images were generated")
            return False

    except Exception as e:
        print(f"ERROR: Connection test failed: {str(e)}")
        return False

async def main():
    """Main test function"""
    print("=" * 50)
    print("RUNWARE API CONNECTION TEST")
    print("=" * 50)

    success = await test_runware_connection()

    print("\n" + "=" * 50)
    if success:
        print("Connection test PASSED!")
        print("Ready to use Runware!")
    else:
        print("Connection test FAILED!")
        print("Please check your API key and try again.")
    print("=" * 50)

    return success

if __name__ == "__main__":
    try:
        result = asyncio.run(main())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\nTest interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        sys.exit(1)