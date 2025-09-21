import React from 'react'
import { CheckCircle, XCircle, RefreshCw, Loader } from 'lucide-react'

const ConnectionStatus = ({ isConnected, connectionChecked, onRetry }) => {
  if (!connectionChecked) {
    return (
      <div className="bg-blue-50 border border-blue-200 px-4 py-2">
        <div className="container mx-auto flex items-center space-x-2">
          <Loader className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-700">Checking connection...</span>
        </div>
      </div>
    )
  }

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 px-4 py-2">
        <div className="container mx-auto flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">
            Connected to Runware API
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">
            Unable to connect to API. Please ensure services are running.
          </span>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center space-x-1 px-3 py-1 bg-red-100 hover:bg-red-200
                     text-red-700 text-xs rounded-md transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  )
}

export default ConnectionStatus