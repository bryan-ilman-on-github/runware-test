import React, { useState, useEffect } from 'react'
import { Download, Loader, Zap, Settings, Image as ImageIcon } from 'lucide-react'

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('runware:101@1')
  const [width, setWidth] = useState(1024)
  const [height, setHeight] = useState(1024)
  const [steps, setSteps] = useState(20)
  const [cfgScale, setCfgScale] = useState(7)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [generationTime, setGenerationTime] = useState(null)
  const [error, setError] = useState(null)
  const [models, setModels] = useState([])

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/models')
      const data = await response.json()
      if (data.success) {
        setModels(data.models)
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const startTime = Date.now()

      const response = await fetch('http://localhost:3001/api/generate/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model,
          width,
          height,
          steps,
          cfgScale,
        }),
      })

      const data = await response.json()
      const endTime = Date.now()

      if (data.success) {
        setGeneratedImage(data.image)
        setGenerationTime((endTime - startTime) / 1000)

        // Save to local storage for gallery
        const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]')
        savedImages.unshift({
          ...data.image,
          timestamp: Date.now(),
          frontendGenerationTime: (endTime - startTime) / 1000
        })
        localStorage.setItem('generatedImages', JSON.stringify(savedImages.slice(0, 20))) // Keep last 20
      } else {
        setError(data.error || 'Failed to generate image')
      }
    } catch (error) {
      setError('Network error: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage.url
      link.download = `runware-${generatedImage.uuid}.jpg`
      link.click()
    }
  }

  const examplePrompts = [
    "a serene mountain landscape at sunset",
    "a futuristic city with flying cars",
    "a magical forest with glowing mushrooms",
    "a steampunk robot in a Victorian workshop",
    "a cozy coffee shop on a rainy day"
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">AI Image Generator</h1>
        <p className="text-gray-600">
          Generate stunning images with Runware's AI technology
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Image Description
            </h3>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="input-field h-24 resize-none"
              disabled={isGenerating}
            />

            {/* Example Prompts */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
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

          {/* Advanced Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Parameters
            </h3>

            <div className="space-y-4">
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="input-field"
                  disabled={isGenerating}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width
                  </label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="input-field"
                    disabled={isGenerating}
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                    <option value={1536}>1536px</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="input-field"
                    disabled={isGenerating}
                  >
                    <option value={512}>512px</option>
                    <option value={768}>768px</option>
                    <option value={1024}>1024px</option>
                    <option value={1536}>1536px</option>
                  </select>
                </div>
              </div>

              {/* Steps and CFG Scale */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Steps: {steps}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CFG Scale: {cfgScale}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={cfgScale}
                    onChange={(e) => setCfgScale(Number(e.target.value))}
                    className="w-full"
                    disabled={isGenerating}
                  />
                </div>
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
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Generated Image */}
          <div className="card min-h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Generated Image</h3>

            <div className="flex-1 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Creating your image...</p>
                </div>
              ) : generatedImage ? (
                <div className="w-full">
                  <img
                    src={generatedImage.url}
                    alt={generatedImage.prompt}
                    className="w-full h-auto rounded-lg shadow-md"
                  />

                  {/* Image Info */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm space-y-1">
                      <p><strong>Model:</strong> {generatedImage.model}</p>
                      <p><strong>Size:</strong> {generatedImage.parameters.width}×{generatedImage.parameters.height}</p>
                      <p><strong>Steps:</strong> {generatedImage.parameters.steps}</p>
                      <p><strong>CFG Scale:</strong> {generatedImage.parameters.cfgScale}</p>
                      {generationTime && (
                        <p><strong>Generation Time:</strong> {generationTime.toFixed(2)}s</p>
                      )}
                    </div>

                    <button
                      onClick={handleDownload}
                      className="mt-3 w-full btn-secondary flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Image</span>
                    </button>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center text-red-600">
                  <p className="mb-2">❌ Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Your generated image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageGenerator