# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- Runware API key from https://my.runware.ai

## Installation Steps

### 1. Clone and Setup
```bash
git clone <repository-url>
cd runware-demo-generator
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev  # Runs on http://localhost:5174
```

### 3. Backend Setup
```bash
cd ../backend
npm install
cp .env.example .env
npm run dev  # Runs on http://localhost:3000
```

### 4. Python Service Setup
```bash
cd ../python-service
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your RUNWARE_API_KEY
python app.py  # Runs on http://localhost:5005
```

### 5. Configure API Key
Add your Runware API key to `python-service/.env`:
```
RUNWARE_API_KEY=your_actual_api_key_here
```

## Testing the Setup

1. Visit http://localhost:5174
2. Try generating an image with a simple prompt like "a cat"
3. Check all three services are running in their respective terminals

## Troubleshooting

- **Port conflicts**: Change ports in respective .env files
- **API errors**: Verify your Runware API key is correct
- **CORS issues**: Ensure frontend URL matches in backend .env