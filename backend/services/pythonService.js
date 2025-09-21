import axios from 'axios';

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';

class PythonService {
    constructor() {
        this.baseURL = PYTHON_SERVICE_URL;
    }

    async makeRequest(endpoint, data = null, method = 'GET') {
        try {
            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                timeout: 30000,
                ...(data && { data })
            };

            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Python service unavailable. Please ensure the Python service is running.');
            }
            if (error.response) {
                throw error.response.data;
            }
            throw new Error('Internal server error');
        }
    }

    async healthCheck() {
        return this.makeRequest('/health');
    }

    async generateImage(imageRequest) {
        return this.makeRequest('/generate/image', imageRequest, 'POST');
    }

    async generateVideo(videoRequest) {
        return this.makeRequest('/generate/video', videoRequest, 'POST');
    }

    async removeBackground(imageData) {
        return this.makeRequest('/remove-background', { image: imageData }, 'POST');
    }

    async upscaleImage(imageData, scaleFactor) {
        return this.makeRequest('/upscale-image', { image: imageData, scaleFactor }, 'POST');
    }

    async captionImage(imageData) {
        return this.makeRequest('/caption-image', { image: imageData }, 'POST');
    }

    async getModels() {
        return this.makeRequest('/models');
    }

    async testConnection() {
        return this.makeRequest('/test-connection');
    }
}

export default new PythonService();