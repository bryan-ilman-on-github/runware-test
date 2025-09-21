#!/usr/bin/env python3
"""
Verify the complete setup is working
"""

import os
import sys
from dotenv import load_dotenv

def verify_setup():
    """Verify all components are properly configured"""
    print("=" * 50)
    print("SETUP VERIFICATION")
    print("=" * 50)

    # Check environment file
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        print("✓ .env file found")
        load_dotenv()
    else:
        print("✗ .env file not found")
        return False

    # Check API key
    api_key = os.getenv('RUNWARE_API_KEY')
    if api_key:
        print(f"✓ API key configured: {api_key[:10]}...")
    else:
        print("✗ RUNWARE_API_KEY not found in environment")
        return False

    # Check required packages
    try:
        import runware
        print("✓ Runware SDK installed")
    except ImportError:
        print("✗ Runware SDK not installed")
        return False

    try:
        import flask
        print("✓ Flask installed")
    except ImportError:
        print("✗ Flask not installed")
        return False

    try:
        import flask_cors
        print("✓ Flask-CORS installed")
    except ImportError:
        print("✗ Flask-CORS not installed")
        return False

    print("\n✓ All components verified successfully!")
    print("Ready to start the Python service!")
    return True

if __name__ == "__main__":
    if verify_setup():
        print("\nTo start the service, run: py app.py")
        sys.exit(0)
    else:
        print("\nPlease fix the issues above before continuing.")
        sys.exit(1)