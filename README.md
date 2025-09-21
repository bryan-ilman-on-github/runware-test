# Runware Showcase

A comprehensive web application demonstrating Runware's AI media generation capabilities, built for a developer meetup presentation.

## 🎯 Project Overview

This demo showcases:
- **Image Generation**: Text-to-image with custom prompts and models
- **Video Generation**: AI-powered video creation
- **Developer Experience**: Clean API integration and real-time performance
- **Interactive Gallery**: Generated content management

## 🏗️ Architecture

```
runware-test/
├── frontend/          # React + Vite web app
├── backend/           # Node.js API server
├── python-service/    # Runware SDK integration
├── docs/             # Documentation
└── start-dev.bat     # Development startup script
```

## 🚀 Quick Start

1. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Python Service**:
   ```bash
   cd python-service
   py -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   py app.py
   ```

## 🔑 API Configuration

Set your Runware API credentials:
```bash
export RUNWARE_API_KEY="your_api_key_here"
```

## 📋 Demo Features

- ✅ Real-time image generation
- ✅ Video creation with custom prompts
- ✅ Multiple model selection
- ✅ Parameter controls (size, steps, CFG scale)
- ✅ Performance metrics display
- ✅ Code examples for developers

## 🎥 Demo Video

See the complete walkthrough and technical presentation at: [Demo Video Link]

---

**Built for Runware Graduate Assessment** | Email: bryanilman20@gmail.com