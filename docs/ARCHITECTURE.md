# Technical Architecture Documentation

## Project Overview
This is a comprehensive AI media generation application built for the Runware Graduate Technical Assessment. The application demonstrates multiple AI capabilities including image generation, video generation architecture, background removal, image upscaling, and image captioning using the Runware SDK.

## Architecture Design

### Three-Tier Architecture
The application follows a clean three-tier architecture pattern:

1. **Frontend (React)** - User interface and client-side logic
2. **Backend (Node.js/Express)** - API gateway and request routing
3. **Python Service (Flask)** - AI processing and Runware SDK integration

### Component Structure

```
runware-test/
├── frontend/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageGenerator.jsx     # Text-to-image generation
│   │   │   ├── VideoGenerator.jsx     # Video generation interface
│   │   │   ├── ImageTools.jsx         # Image processing tools
│   │   │   └── Gallery.jsx            # Generated content gallery
│   │   └── App.jsx
├── backend/           # Node.js Express API
│   ├── server.js                      # Main server with route forwarding
│   └── services/
│       └── pythonService.js           # Python service client
├── python-service/    # Flask AI service
│   ├── app.py                         # Flask application factory
│   ├── services/
│   │   ├── runware_client.py          # Runware SDK wrapper
│   │   └── image_service.py           # Business logic layer
│   └── routes/
│       ├── health.py                  # Health checks and models
│       ├── generation.py              # Image/video generation
│       └── processing.py              # Image processing tools
└── docs/              # Documentation
```

## Technical Decisions

### 1. Architecture Pattern Choice
**Decision**: Three-tier architecture with clear separation of concerns
**Rationale**:
- Frontend focuses purely on UI/UX
- Backend acts as API gateway for CORS and request routing
- Python service encapsulates all AI processing logic
- Enables independent scaling and deployment of components

### 2. Python Service Design
**Decision**: Flask with Blueprint pattern and service layer
**Rationale**:
- Blueprints organize routes by functionality
- Service layer separates business logic from HTTP concerns
- Facilitates testing and maintenance
- Clean dependency injection pattern

### 3. Runware SDK Integration
**Decision**: Centralized client with connection management
**Rationale**:
- Single WebSocket connection shared across requests
- Automatic reconnection handling
- Consistent error handling and logging
- Performance optimization through connection reuse

### 4. Error Handling Strategy
**Decision**: Graceful degradation with informative messages
**Rationale**:
- Video generation shows architecture demo when credits unavailable
- Background removal/upscaling provide clear error feedback
- Health checks validate service connectivity
- User-friendly error messages without technical details

### 5. Image Processing Pipeline
**Decision**: Base64 encoding for file transfers
**Rationale**:
- Supports large image uploads (50MB limit)
- JSON-compatible data transfer
- No temporary file management required
- Cross-platform compatibility

## API Design

### Request Flow
1. Frontend sends request to Backend (:3000)
2. Backend forwards to Python Service (:5005)
3. Python Service processes via Runware SDK
4. Response propagates back through the chain

### Endpoint Structure
```
GET  /api/health           # Service health status
GET  /api/models           # Available AI models
POST /api/generate/image   # Text-to-image generation
POST /api/generate/video   # Video generation
POST /api/remove-background # Background removal
POST /api/upscale-image    # Image upscaling
POST /api/caption-image    # Image captioning
```

## Performance Considerations

### Connection Management
- Single persistent WebSocket to Runware API
- Automatic reconnection on connection loss
- Connection pooling for concurrent requests

### Memory Management
- 50MB request limit for large image uploads
- Base64 encoding/decoding handled efficiently
- No persistent file storage required

### Error Recovery
- Graceful handling of SDK version differences
- Fallback responses for unavailable features
- Comprehensive logging for debugging

## Development Workflow

### Local Development
1. Start Python service: `cd python-service && venv\Scripts\activate && py app.py`
2. Start Backend: `cd backend && npm run dev`
3. Start Frontend: `cd frontend && npm run dev`

Or use the provided batch script: `start-dev.bat`

### Environment Configuration
- Runware API key in `.env` file
- CORS configured for development ports
- Hot reload enabled for all services

## Future Considerations

### Scalability
- Python service can be containerized and scaled horizontally
- Backend can implement load balancing to multiple Python instances
- Frontend can be deployed to CDN for global distribution

### Monitoring
- Health checks provide service status
- Structured logging enables monitoring integration
- Response times tracked for performance analysis

### Security
- API key management through environment variables
- CORS properly configured for production
- Input validation on all endpoints

## Testing Strategy

### Component Testing
- Individual service health checks
- End-to-end feature testing through UI
- SDK connection validation

### Integration Testing
- Cross-service communication validation
- Error propagation testing
- Performance benchmarking

This architecture provides a solid foundation for AI media generation while maintaining clean separation of concerns and enabling future enhancements.