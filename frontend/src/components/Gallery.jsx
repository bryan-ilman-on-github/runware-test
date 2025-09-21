import React, { useState, useEffect } from 'react'
import { Download, Trash2, Grid, Calendar, Clock } from 'lucide-react'
import runwareLogo from '../assets/runware-logo.png'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = () => {
    const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]')
    setImages(savedImages)
  }

  const handleDownload = (image) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = `runware-${image.uuid}.jpg`
    link.click()
  }

  const handleDelete = (imageToDelete) => {
    const updatedImages = images.filter(img => img.uuid !== imageToDelete.uuid)
    setImages(updatedImages)
    localStorage.setItem('generatedImages', JSON.stringify(updatedImages))

    if (selectedImage?.uuid === imageToDelete.uuid) {
      setSelectedImage(null)
    }
  }

  const clearAllImages = () => {
    if (window.confirm('Are you sure you want to delete all images?')) {
      setImages([])
      setSelectedImage(null)
      localStorage.removeItem('generatedImages')
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Grid className="w-8 h-8 mr-3" />
            Generated Images
          </h1>
          <p className="text-gray-600 mt-1">
            {images.length} image{images.length !== 1 ? 's' : ''} in your gallery
          </p>
        </div>

        {images.length > 0 && (
          <button
            onClick={clearAllImages}
            className="btn-secondary flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {images.length === 0 ? (
        <div className="card text-center py-12">
          <Grid className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No images generated yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start generating images to see them appear in your gallery
          </p>
          <a
            href="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <img src={runwareLogo} alt="Runware" className="w-4 h-4 rounded" />
            <span>Generate Your First Image</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.uuid}
                  className={`
                    relative group cursor-pointer rounded-lg overflow-hidden
                    transition-all duration-200 hover:shadow-lg
                    ${selectedImage?.uuid === image.uuid
                      ? 'ring-2 ring-blue-500 shadow-lg'
                      : 'shadow-sm hover:shadow-md'
                    }
                  `}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-48 object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30
                                transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity
                                  duration-200 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(image)
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100
                                 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(image)
                        }}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50
                                 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Generation time badge */}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white
                                text-xs px-2 py-1 rounded-md flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{image.generationTime?.toFixed(1)}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Details */}
          <div className="space-y-6">
            {selectedImage ? (
              <>
                {/* Selected Image */}
                <div className="card">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.prompt}
                    className="w-full h-auto rounded-lg"
                  />
                </div>

                {/* Image Info */}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Image Details</h3>

                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-700">Prompt:</strong>
                      <p className="text-gray-600 mt-1">"{selectedImage.prompt}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="text-gray-700">Model:</strong>
                        <p className="text-gray-600">{selectedImage.model}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Size:</strong>
                        <p className="text-gray-600">
                          {selectedImage.parameters.width}×{selectedImage.parameters.height}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="text-gray-700">Steps:</strong>
                        <p className="text-gray-600">{selectedImage.parameters.steps}</p>
                      </div>
                      <div>
                        <strong className="text-gray-700">CFG Scale:</strong>
                        <p className="text-gray-600">{selectedImage.parameters.cfgScale}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="text-gray-700">Generated:</strong>
                        <p className="text-gray-600 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(selectedImage.timestamp)}
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-700">Time:</strong>
                        <p className="text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {selectedImage.generationTime?.toFixed(2)}s
                        </p>
                      </div>
                    </div>

                    <div>
                      <strong className="text-gray-700">UUID:</strong>
                      <p className="text-gray-600 font-mono text-xs break-all">
                        {selectedImage.uuid}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => handleDownload(selectedImage)}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleDelete(selectedImage)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="card text-center py-12">
                <Grid className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Select an image to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery