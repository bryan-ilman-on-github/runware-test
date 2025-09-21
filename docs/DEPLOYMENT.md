# Deployment Guide

## Local Development Deployment

The application is designed to run locally for development and demonstration purposes. All services can be started with a single command.

### Quick Deployment

#### Windows
```bash
# Clone repository
git clone [repository-url]
cd runware-test

# Install dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd python-service && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && cd ..

# Configure API key
echo "RUNWARE_API_KEY=your_api_key_here" > python-service/.env

# Start all services
start-dev.bat
```

#### macOS/Linux
```bash
# Clone repository
git clone [repository-url]
cd runware-test

# Install dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd python-service && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ..

# Configure API key
echo "RUNWARE_API_KEY=your_api_key_here" > python-service/.env

# Start services manually (in separate terminals)
# Terminal 1: cd python-service && source venv/bin/activate && python app.py
# Terminal 2: cd backend && npm run dev
# Terminal 3: cd frontend && npm run dev
```

### Service Ports
- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:3000
- **Python Service**: http://localhost:5005

## Production Deployment Options

### Docker Containerization

#### Frontend (Dockerfile.frontend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

#### Backend (Dockerfile.backend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
EXPOSE 3000
CMD ["npm", "start"]
```

#### Python Service (Dockerfile.python)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY python-service/requirements.txt .
RUN pip install -r requirements.txt
COPY python-service/ .
EXPOSE 5005
CMD ["python", "app.py"]
```

#### Docker Compose (docker-compose.yml)
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3000:3000"
    environment:
      - PYTHON_SERVICE_URL=http://python-service:5005
    depends_on:
      - python-service

  python-service:
    build:
      context: .
      dockerfile: Dockerfile.python
    ports:
      - "5005:5005"
    environment:
      - RUNWARE_API_KEY=${RUNWARE_API_KEY}
```

### Cloud Deployment

#### Heroku
1. **Python Service**:
   ```bash
   # Create Heroku app
   heroku create runware-python-service

   # Set environment variable
   heroku config:set RUNWARE_API_KEY=your_api_key

   # Deploy
   git subtree push --prefix python-service heroku main
   ```

2. **Backend**:
   ```bash
   heroku create runware-backend
   heroku config:set PYTHON_SERVICE_URL=https://runware-python-service.herokuapp.com
   git subtree push --prefix backend heroku main
   ```

3. **Frontend**:
   ```bash
   heroku create runware-frontend
   heroku config:set VITE_API_URL=https://runware-backend.herokuapp.com
   git subtree push --prefix frontend heroku main
   ```

#### AWS Deployment

**Option 1: AWS Lambda + API Gateway**
- Package Python service as Lambda function
- Use API Gateway for REST endpoints
- Host frontend on S3 + CloudFront

**Option 2: AWS ECS**
- Deploy containerized services to ECS
- Use Application Load Balancer for routing
- Store environment variables in AWS Secrets Manager

#### Digital Ocean App Platform
```yaml
name: runware-app
services:
- name: python-service
  source_dir: python-service
  github:
    repo: your-repo
    branch: main
  run_command: python app.py
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: RUNWARE_API_KEY
    value: your_api_key

- name: backend
  source_dir: backend
  github:
    repo: your-repo
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: PYTHON_SERVICE_URL
    value: ${python-service.PUBLIC_URL}

- name: frontend
  source_dir: frontend
  github:
    repo: your-repo
    branch: main
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VITE_API_URL
    value: ${backend.PUBLIC_URL}
```

## Environment Configuration

### Development
```bash
# python-service/.env
RUNWARE_API_KEY=your_development_key
FLASK_ENV=development
FLASK_DEBUG=1

# backend/.env
PYTHON_SERVICE_URL=http://localhost:5005
FRONTEND_URL=http://localhost:5174
NODE_ENV=development

# frontend/.env
VITE_API_URL=http://localhost:3000
```

### Production
```bash
# python-service/.env
RUNWARE_API_KEY=your_production_key
FLASK_ENV=production
FLASK_DEBUG=0

# backend/.env
PYTHON_SERVICE_URL=https://your-python-service.com
FRONTEND_URL=https://your-frontend.com
NODE_ENV=production

# frontend/.env
VITE_API_URL=https://your-backend.com
```

## Monitoring and Health Checks

### Health Check Endpoints
- **Python Service**: `GET /health`
- **Backend**: `GET /api/health`
- **Frontend**: Visual health indicator in UI

### Monitoring Setup
```bash
# Simple uptime monitoring
curl -f http://localhost:5005/health || exit 1
curl -f http://localhost:3000/api/health || exit 1
```

### Log Aggregation
- Python service logs to stdout
- Backend logs to stdout with timestamps
- Frontend logs to browser console

## Performance Optimization

### Production Optimizations
1. **Frontend**:
   - Build optimization with Vite
   - Asset compression and minification
   - CDN for static assets

2. **Backend**:
   - Enable gzip compression
   - Connection pooling
   - Request rate limiting

3. **Python Service**:
   - Connection pool for Runware API
   - Image processing optimization
   - Memory management for large uploads

### Scaling Considerations
- Horizontal scaling for backend and Python service
- Load balancer configuration
- Database for persistent storage (if needed)
- Redis for session management
- File storage service for generated content

## Security Considerations

### API Key Management
- Never commit API keys to version control
- Use environment variables or secret management services
- Rotate keys regularly

### Network Security
- HTTPS in production
- CORS properly configured
- Input validation on all endpoints
- Rate limiting for API endpoints

### Application Security
- Sanitize file uploads
- Validate image formats and sizes
- Implement authentication if needed
- Monitor for unusual usage patterns

## Backup and Recovery

### Data Backup
- Environment configuration backup
- Application code in version control
- Generated content stored externally if needed

### Disaster Recovery
- Infrastructure as code for quick rebuilding
- Automated deployment pipelines
- Health monitoring with alerting
- Rollback procedures documented