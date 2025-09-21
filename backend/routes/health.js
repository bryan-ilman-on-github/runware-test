import express from 'express';
import pythonService from '../services/pythonService.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        const pythonHealth = await pythonService.healthCheck();

        res.json({
            status: 'healthy',
            service: 'runware-demo-backend',
            timestamp: new Date().toISOString(),
            pythonService: pythonHealth
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

// Get available models
router.get('/models', async (req, res) => {
    try {
        const response = await pythonService.getModels();
        res.json(response);
    } catch (error) {
        console.error('Models fetch error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch models'
        });
    }
});

// Test Runware connection
router.get('/test-connection', async (req, res) => {
    try {
        console.log('Testing Runware connection...');
        const response = await pythonService.testConnection();

        if (response.success) {
            console.log('Runware connection test successful');
        } else {
            console.log('Runware connection test failed');
        }

        res.json(response);
    } catch (error) {
        console.error('Connection test error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to test connection'
        });
    }
});

export default router;