import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Check Python service health
        const pythonHealth = await axios.get(`${PYTHON_SERVICE_URL}/health`);

        res.json({
            status: 'healthy',
            service: 'runware-demo-backend',
            timestamp: new Date().toISOString(),
            pythonService: pythonHealth.data
        });
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            service: 'runware-demo-backend',
            error: 'Python service unavailable',
            timestamp: new Date().toISOString()
        });
    }
});

// Image generation endpoint
app.post('/api/generate/image', async (req, res) => {
    try {
        const {
            prompt,
            model = 'runware:101@1',
            width = 1024,
            height = 1024,
            steps = 20,
            cfgScale = 7
        } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        console.log(`Generating image: "${prompt}"`);

        // Forward request to Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/generate/image`, {
            prompt,
            model,
            width,
            height,
            steps,
            cfgScale
        }, {
            timeout: 30000 // 30 second timeout
        });

        console.log(`Image generated successfully in ${response.data.metadata?.processingTime}s`);

        res.json(response.data);

    } catch (error) {
        console.error('Image generation error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Python service unavailable. Please ensure the Python service is running.'
            });
        }

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Video generation endpoint
app.post('/api/generate/video', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        console.log(`Video generation request: "${prompt}"`);

        // Forward request to Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/generate/video`, {
            prompt
        });

        res.json(response.data);

    } catch (error) {
        console.error('Video generation error:', error.message);

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get available models
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/models`);
        res.json(response.data);
    } catch (error) {
        console.error('Models fetch error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch models'
        });
    }
});

// Test Runware connection
app.get('/api/test-connection', async (req, res) => {
    try {
        console.log('Testing Runware connection...');
        const response = await axios.get(`${PYTHON_SERVICE_URL}/test-connection`);

        if (response.data.success) {
            console.log('Runware connection test successful');
        } else {
            console.log('Runware connection test failed');
        }

        res.json(response.data);
    } catch (error) {
        console.error('Connection test error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to test connection'
        });
    }
});

// Background removal endpoint
app.post('/api/remove-background', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Image data is required'
            });
        }

        console.log('Processing background removal...');

        // Forward request to Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/remove-background`, {
            image
        }, {
            timeout: 30000 // 30 second timeout
        });

        console.log(`Background removal completed in ${response.data.metadata?.processingTime}s`);

        res.json(response.data);

    } catch (error) {
        console.error('Background removal error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Python service unavailable. Please ensure the Python service is running.'
            });
        }

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Image upscaling endpoint
app.post('/api/upscale-image', async (req, res) => {
    try {
        const { image, scaleFactor = 2 } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Image data is required'
            });
        }

        console.log(`Processing image upscaling with factor ${scaleFactor}...`);

        // Forward request to Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/upscale-image`, {
            image,
            scaleFactor
        }, {
            timeout: 30000 // 30 second timeout
        });

        console.log(`Image upscaling completed in ${response.data.metadata?.processingTime}s`);

        res.json(response.data);

    } catch (error) {
        console.error('Image upscaling error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Python service unavailable. Please ensure the Python service is running.'
            });
        }

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Image caption endpoint
app.post('/api/caption-image', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Image data is required'
            });
        }

        console.log('Processing image captioning...');

        // Forward request to Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/caption-image`, {
            image
        }, {
            timeout: 30000 // 30 second timeout
        });

        console.log(`Caption generated in ${response.data.metadata?.processingTime}s`);

        res.json(response.data);

    } catch (error) {
        console.error('Image captioning error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Python service unavailable. Please ensure the Python service is running.'
            });
        }

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Image to text endpoint
app.post('/api/image-to-text', async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Image data is required'
            });
        }

        console.log('Processing text extraction...');

        // Forward request to Python service
        const response = await axios.post(`${PYTHON_SERVICE_URL}/image-to-text`, {
            image
        }, {
            timeout: 30000 // 30 second timeout
        });

        console.log(`Text extracted in ${response.data.metadata?.processingTime}s`);

        res.json(response.data);

    } catch (error) {
        console.error('Text extraction error:', error.message);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Python service unavailable. Please ensure the Python service is running.'
            });
        }

        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('Runware Demo Backend Server Started');
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Python service: ${PYTHON_SERVICE_URL}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log('Available endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/models');
    console.log('   GET  /api/test-connection');
    console.log('   POST /api/generate/image');
    console.log('   POST /api/generate/video');
    console.log('   POST /api/remove-background');
    console.log('   POST /api/upscale-image');
    console.log('   POST /api/caption-image');
    console.log('   POST /api/image-to-text');
});