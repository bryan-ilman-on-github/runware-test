import React, { useState } from 'react'
import { Upload, Download, Loader, Scissors, ZoomIn, ImageIcon, MessageCircle, FileText } from 'lucide-react'

const ImageTools = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingType, setProcessingType] = useState('')
  const [error, setError] = useState(null)
  const [scaleFactor, setScaleFactor] = useState(2)
  const [imageCaption, setImageCaption] = useState(null)
  const [extractedText, setExtractedText] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      setProcessedImage(null)
      setImageCaption(null)
      setExtractedText(null)
      setError(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const removeBackground = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setIsProcessing(true)
    setProcessingType('background removal')
    setError(null)

    try {
      const base64Image = await convertToBase64(selectedImage)

      const response = await fetch('http://localhost:3001/api/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProcessedImage(data.image)
      } else {
        setError(data.error || 'Failed to remove background')
      }
    } catch (error) {
      setError('Network error: ' + error.message)
    } finally {
      setIsProcessing(false)
      setProcessingType('')
    }
  }

  const upscaleImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setIsProcessing(true)
    setProcessingType('image upscaling')
    setError(null)

    try {
      const base64Image = await convertToBase64(selectedImage)

      const response = await fetch('http://localhost:3001/api/upscale-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          scaleFactor: scaleFactor
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProcessedImage(data.image)
      } else {
        setError(data.error || 'Failed to upscale image')
      }
    } catch (error) {
      setError('Network error: ' + error.message)
    } finally {
      setIsProcessing(false)
      setProcessingType('')
    }
  }

  const captionImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setIsProcessing(true)
    setProcessingType('image captioning')
    setError(null)

    try {
      const base64Image = await convertToBase64(selectedImage)

      const response = await fetch('http://localhost:3001/api/caption-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        }),
      })

      const data = await response.json()

      if (data.success) {
        setImageCaption(data)
      } else {
        setError(data.error || 'Failed to generate caption')
      }
    } catch (error) {
      setError('Network error: ' + error.message)
    } finally {
      setIsProcessing(false)
      setProcessingType('')
    }
  }

  const extractText = async () => {
    if (!selectedImage) {
      setError('Please select an image first')
      return
    }

    setIsProcessing(true)
    setProcessingType('text extraction')
    setError(null)

    try {
      const base64Image = await convertToBase64(selectedImage)

      const response = await fetch('http://localhost:3001/api/image-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        }),
      })

      const data = await response.json()

      if (data.success) {
        setExtractedText(data)
      } else {
        setError(data.error || 'Failed to extract text')
      }
    } catch (error) {
      setError('Network error: ' + error.message)
    } finally {
      setIsProcessing(false)
      setProcessingType('')
    }
  }

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = filename
    link.click()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">AI Image Tools</h1>
        <p className="text-gray-600">
          Advanced image processing with Runware's AI technology
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload and Controls */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Image
            </h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <ImageIcon className="w-12 h-12 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to upload an image
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, WEBP up to 10MB
                </span>
              </label>
            </div>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded-lg border"
                />
                <p className="text-sm text-gray-600 mt-2">
                  File: {selectedImage?.name}
                </p>
              </div>
            )}
          </div>

          {/* Tools */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Processing Tools</h3>

            <div className="space-y-4">
              {/* Background Removal */}
              <button
                onClick={removeBackground}
                disabled={!selectedImage || isProcessing}
                className={`
                  w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                  font-medium transition-all duration-200
                  ${!selectedImage || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isProcessing && processingType === 'background removal' ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Removing Background...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>Remove Background</span>
                  </>
                )}
              </button>

              {/* Image Upscaling */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Scale Factor:
                  </label>
                  <select
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(Number(e.target.value))}
                    className="input-field flex-1"
                    disabled={isProcessing}
                  >
                    <option value={2}>2x</option>
                    <option value={3}>3x</option>
                    <option value={4}>4x</option>
                  </select>
                </div>

                <button
                  onClick={upscaleImage}
                  disabled={!selectedImage || isProcessing}
                  className={`
                    w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                    font-medium transition-all duration-200
                    ${!selectedImage || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {isProcessing && processingType === 'image upscaling' ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Upscaling Image...</span>
                    </>
                  ) : (
                    <>
                      <ZoomIn className="w-5 h-5" />
                      <span>Upscale Image ({scaleFactor}x)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Image Caption */}
              <button
                onClick={captionImage}
                disabled={!selectedImage || isProcessing}
                className={`
                  w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                  font-medium transition-all duration-200
                  ${!selectedImage || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isProcessing && processingType === 'image captioning' ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Caption...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>Generate Caption</span>
                  </>
                )}
              </button>

              {/* Text Extraction - Hidden for now */}
              {false && (
                <button
                  onClick={extractText}
                  disabled={!selectedImage || isProcessing}
                  className={`
                    w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                    font-medium transition-all duration-200
                    ${!selectedImage || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {isProcessing && processingType === 'text extraction' ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Extracting Text...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>Extract Text (OCR)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Processed Image */}
          <div className="card min-h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Processed Image</h3>

            <div className="flex-1 flex items-center justify-center">
              {isProcessing ? (
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Processing your image...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Running {processingType}
                  </p>
                </div>
              ) : processedImage ? (
                <div className="w-full">
                  <img
                    src={processedImage.url}
                    alt="Processed"
                    className="w-full h-auto rounded-lg shadow-md"
                  />

                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm space-y-1">
                      <p><strong>Processing Complete!</strong></p>
                      <p><strong>Processing Time:</strong> {processedImage.processingTime}s</p>
                      {processedImage.scaleFactor && (
                        <p><strong>Scale Factor:</strong> {processedImage.scaleFactor}x</p>
                      )}
                      <p><strong>UUID:</strong> <span className="font-mono text-xs">{processedImage.uuid}</span></p>
                    </div>

                    <button
                      onClick={() => downloadImage(
                        processedImage.url,
                        `processed-${processedImage.uuid}.jpg`
                      )}
                      className="mt-3 w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Processed Image</span>
                    </button>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center text-red-600">
                  <p className="mb-2">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Processed image will appear here</p>
                  <p className="text-sm mt-2">Upload an image and select a tool to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Text Results */}
          {(imageCaption) && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Text Results</h3>

              <div className="space-y-4">
                {imageCaption && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <MessageCircle className="w-5 h-5 text-purple-600 mr-2" />
                      <h4 className="font-medium text-purple-800">Generated Caption</h4>
                    </div>
                    <p className="text-gray-700 mb-2">{imageCaption.caption}</p>
                    <p className="text-sm text-purple-600">
                      Processing time: {imageCaption.processingTime}s
                    </p>
                  </div>
                )}

                {false && extractedText && (
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center mb-2">
                      <FileText className="w-5 h-5 text-orange-600 mr-2" />
                      <h4 className="font-medium text-orange-800">Extracted Text (OCR)</h4>
                    </div>
                    <p className="text-gray-700 mb-2 whitespace-pre-wrap">{extractedText.text}</p>
                    <p className="text-sm text-orange-600">
                      Processing time: {extractedText.processingTime}s
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageTools