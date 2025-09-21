# Runware Technical Assessment

A comprehensive AI media generation application showcasing Runware's capabilities through a modern, full-stack implementation.

## Features

- **AI Image Generation** - Text-to-image with multiple models and parameter control
- **Video Generation Architecture** - Complete async video processing pipeline
- **Background Removal** - Professional-grade image background removal
- **Image Upscaling** - AI-powered image enhancement (2x, 3x, 4x)
- **Image Captioning** - Intelligent image description generation
- **Responsive Design** - Clean, modern interface across all devices
- **Real-time Processing** - Live feedback and progress tracking

## Architecture

**Three-Tier Design:**
- **Frontend** (React + Vite) - Modern responsive UI
- **Backend** (Node.js + Express) - API gateway and routing
- **Python Service** (Flask) - AI processing and Runware SDK integration

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Runware API key ([Get one here](https://runware.ai))

### Setup
1. **Clone and install:**
   ```bash
   git clone [repository-url]
   cd runware-test

   # Install frontend dependencies
   cd frontend && npm install && cd ..

   # Install backend dependencies
   cd backend && npm install && cd ..

   # Setup Python environment
   cd python-service
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   cd ..
   ```

2. **Configure environment:**
   ```bash
   # Create .env file in python-service/
   echo "RUNWARE_API_KEY=your_api_key_here" > python-service/.env
   ```

3. **Start all services:**
   ```bash
   # Option 1: Use the provided script (Windows)
   start-dev.bat

   # Option 2: Manual startup
   # Terminal 1: Python service
   cd python-service && venv\Scripts\activate && py app.py

   # Terminal 2: Backend
   cd backend && npm run dev

   # Terminal 3: Frontend
   cd frontend && npm run dev
   ```

### Access Points
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Python Service:** http://localhost:5000

## Usage

### Image Generation
1. Navigate to the **Image Generator** tab
2. Enter your text prompt
3. Adjust parameters (model, dimensions, steps, CFG scale)
4. Click **Generate Image**
5. Download or save to gallery

### Video Generation
1. Go to **Video Generator** tab
2. Enter video description
3. Set duration, quality, and frame rate
4. Generate (requires API credits)

### Image Tools
1. Open **Image Tools** tab
2. Upload an image (drag & drop or click)
3. Use processing tools:
   - **Remove Background** - Clean background removal
   - **Upscale Image** - Enhance resolution 2x-4x
   - **Generate Caption** - AI-powered descriptions

## Development

### Project Structure
```
runware-test/
├── frontend/           # React application
│   ├── src/components/ # UI components
│   └── src/styles/     # Tailwind CSS
├── backend/            # Express API server
│   ├── server.js       # Main server
│   └── services/       # Service abstractions
├── python-service/     # Flask AI service
│   ├── app.py          # Application factory
│   ├── services/       # Business logic
│   └── routes/         # API endpoints
└── docs/              # Documentation
```

### API Endpoints

**Health & Info:**
- `GET /api/health` - Service status
- `GET /api/models` - Available AI models

**Generation:**
- `POST /api/generate/image` - Image generation
- `POST /api/generate/video` - Video generation

**Processing:**
- `POST /api/remove-background` - Background removal
- `POST /api/upscale-image` - Image upscaling
- `POST /api/caption-image` - Image captioning

### Environment Variables
```bash
# python-service/.env
RUNWARE_API_KEY=your_runware_api_key

# Optional overrides
FRONTEND_URL=http://localhost:5173
PYTHON_SERVICE_URL=http://localhost:5000
PORT=3001
```

## Technical Details

### Performance Features
- Single persistent WebSocket connection to Runware API
- 50MB request limit for large image uploads
- Efficient base64 encoding pipeline
- Automatic connection management and recovery

### Error Handling
- Graceful degradation for unavailable features
- Comprehensive error messages and user feedback
- Health monitoring across all services
- Professional logging throughout the stack

### Production Ready
- Clean separation of concerns
- Environment-based configuration
- CORS properly configured
- Scalable architecture pattern

## Testing

### Manual Testing
```bash
# Test Python service directly
cd python-service && python test_connection.py

# Health check all services
curl http://localhost:5000/health  # Python
curl http://localhost:3001/api/health  # Backend
```

### Feature Testing
1. **Image Generation:** Use the UI to generate images with different prompts
2. **Background Removal:** Upload images and test processing
3. **Upscaling:** Test with various scale factors
4. **Error Handling:** Test with invalid inputs

## Troubleshooting

**Common Issues:**

- **"Unable to connect to API"** - Ensure all three services are running
- **CORS errors** - Check port configurations match environment
- **Python import errors** - Verify virtual environment is activated
- **API key issues** - Ensure `.env` file exists with valid key

**Service Status:**
```bash
# Check if services are running
netstat -an | findstr ":5000"  # Python service
netstat -an | findstr ":3001"  # Backend
netstat -an | findstr ":5173"  # Frontend
```

## Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Runware API Documentation](https://docs.runware.ai)

## Future Enhancements

- Real-time collaborative editing
- Batch processing capabilities
- Advanced parameter presets
- Integration with cloud storage
- Performance analytics dashboard

---

Built for the Runware Graduate Technical Assessment