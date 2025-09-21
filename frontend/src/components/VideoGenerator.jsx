import React, { useState } from 'react'
import { Video, Loader, Info } from 'lucide-react'

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(10)
  const [quality, setQuality] = useState('1080p')
  const [frameRate, setFrameRate] = useState(30)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedVideo(null)

    try {
      // Convert quality to dimensions
      const dimensions = quality === '4K' ? { width: 3840, height: 2160 } :
                        quality === '1080p' ? { width: 1920, height: 1080 } :
                        { width: 1280, height: 720 }

      const response = await fetch('http://localhost:3000/api/generate/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration,
          width: dimensions.width,
          height: dimensions.height,
          outputFormat: 'mp4',
          outputQuality: 95
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedVideo(data.video)
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

      {/* API Info Notice */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Video Generation Ready
            </h3>
            <p className="text-blue-800 mt-1">
              Video generation uses Runware's async video inference API. Videos are processed
              asynchronously and may take longer than image generation depending on duration and quality.
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
              <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "A time-lapse of a flower blooming",
                  "Waves crashing on a beach at sunset",
                  "A cat playing with a ball of yarn",
                  "Rain falling on a city street"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200
                             rounded-md text-gray-700 transition-colors"
                    disabled={isGenerating}
                  >
                    {example}
                  </button>
                ))}
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
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input-field"
                  disabled={isGenerating}
                >
                  <option value={5}>5 seconds</option>
                  <option value={10}>10 seconds</option>
                  <option value={15}>15 seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="input-field"
                  disabled={isGenerating}
                >
                  <option value="720p">Standard (720p)</option>
                  <option value="1080p">High (1080p)</option>
                  <option value="4K">Ultra (4K)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frame Rate
                </label>
                <select
                  value={frameRate}
                  onChange={(e) => setFrameRate(Number(e.target.value))}
                  className="input-field"
                  disabled={isGenerating}
                >
                  <option value={24}>24 FPS</option>
                  <option value={30}>30 FPS</option>
                  <option value={60}>60 FPS</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`
              w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
              font-medium transition-all duration-200
              ${isGenerating || !prompt.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating Video...</span>
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Video Preview */}
          <div className="card min-h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Video Preview</h3>

            <div className="flex-1 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Creating your video...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                </div>
              ) : generatedVideo ? (
                <div className="w-full">
                  {generatedVideo.url ? (
                    // Actual video generated
                    <div className="space-y-4">
                      <video
                        src={generatedVideo.url}
                        controls
                        className="w-full h-auto rounded-lg shadow-md"
                        poster={generatedVideo.thumbnailUrl}
                      >
                        Your browser does not support the video tag.
                      </video>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm space-y-2">
                          <p><strong>Video Generated Successfully!</strong></p>
                          <p><strong>Prompt:</strong> "{generatedVideo.prompt}"</p>
                          <p><strong>Model:</strong> {generatedVideo.model}</p>
                          <p><strong>Generation Time:</strong> {generatedVideo.generationTime}s</p>
                          {generatedVideo.cost && (
                            <p><strong>Cost:</strong> ${generatedVideo.cost}</p>
                          )}
                          <div>
                            <p><strong>Parameters:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>Duration: {generatedVideo.parameters.duration}s</li>
                              <li>Resolution: {generatedVideo.parameters.width}×{generatedVideo.parameters.height}</li>
                              <li>Format: {generatedVideo.parameters.outputFormat}</li>
                              <li>Quality: {generatedVideo.parameters.outputQuality}%</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Demo/processing response
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm space-y-2">
                        <p><strong>Status:</strong> {generatedVideo.status}</p>
                        <p><strong>Message:</strong> {generatedVideo.message}</p>
                        <p><strong>Prompt:</strong> "{generatedVideo.prompt}"</p>
                        <p><strong>Model:</strong> {generatedVideo.model}</p>
                        {generatedVideo.parameters && (
                          <div>
                            <p><strong>Parameters:</strong></p>
                            <ul className="ml-4 space-y-1">
                              <li>Duration: {generatedVideo.parameters.duration}s</li>
                              <li>Resolution: {generatedVideo.parameters.width}×{generatedVideo.parameters.height}</li>
                              <li>Format: {generatedVideo.parameters.outputFormat}</li>
                              <li>Quality: {generatedVideo.parameters.outputQuality}%</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : error ? (
                <div className="text-center text-red-600">
                  <p className="mb-2">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Generated video will appear here</p>
                  <p className="text-sm mt-2">Enter a prompt to get started</p>
                </div>
              )}
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