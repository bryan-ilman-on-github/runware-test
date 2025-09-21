import React, { useState } from 'react'
import { Video, Loader, Info } from 'lucide-react'

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/generate/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (data.success) {
        // Handle video generation response
        console.log('Video generation response:', data)
      } else {
        setError(data.error || 'Failed to generate video')
      }
    } catch (error) {
      setError('Network error: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">AI Video Generator</h1>
        <p className="text-gray-600">
          Generate videos with Runware's AI technology
        </p>
      </div>

      {/* Coming Soon Notice */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Video Generation Coming Soon
            </h3>
            <p className="text-blue-800 mt-1">
              Video generation functionality is currently in development and will be available
              when Runware's video API is fully released. The interface below shows what the
              experience will look like.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Video Description
            </h3>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              className="input-field h-24 resize-none"
              disabled={isGenerating}
            />

            {/* Example Prompts */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Example prompts:</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>• "A time-lapse of a flower blooming"</p>
                <p>• "Waves crashing on a beach at sunset"</p>
                <p>• "A cat playing with a ball of yarn"</p>
                <p>• "Rain falling on a city street"</p>
              </div>
            </div>
          </div>

          {/* Video Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select className="input-field" disabled>
                  <option>5 seconds</option>
                  <option>10 seconds</option>
                  <option>15 seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality
                </label>
                <select className="input-field" disabled>
                  <option>Standard (720p)</option>
                  <option>High (1080p)</option>
                  <option>Ultra (4K)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frame Rate
                </label>
                <select className="input-field" disabled>
                  <option>24 FPS</option>
                  <option>30 FPS</option>
                  <option>60 FPS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={true} // Disabled for demo
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                       font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
          >
            <Video className="w-5 h-5" />
            <span>Generate Video (Coming Soon)</span>
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Video Preview */}
          <div className="card min-h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Video Preview</h3>

            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Generated video will appear here</p>
                <p className="text-sm mt-2">Video generation coming soon</p>
              </div>
            </div>
          </div>

          {/* API Integration Preview */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">API Integration</h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
              <div className="space-y-1">
                <div>// Video generation with Runware API</div>
                <div>const response = await runware.videoInference(&#123;</div>
                <div className="ml-4">prompt: "{prompt || 'your video description'}",</div>
                <div className="ml-4">duration: 10,</div>
                <div className="ml-4">quality: "1080p",</div>
                <div className="ml-4">fps: 30</div>
                <div>&#125;);</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="card bg-red-50 border-red-200">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoGenerator