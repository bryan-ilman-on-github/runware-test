import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import ImageGenerator from './components/ImageGenerator'
import VideoGenerator from './components/VideoGenerator'
import ImageTools from './components/ImageTools'
import Gallery from './components/Gallery'
import ConnectionStatus from './components/ConnectionStatus'

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionChecked, setConnectionChecked] = useState(false)

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/health')
      const data = await response.json()
      setIsConnected(data.status === 'healthy')
    } catch (error) {
      console.error('Connection check failed:', error)
      setIsConnected(false)
    } finally {
      setConnectionChecked(true)
    }
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ConnectionStatus
          isConnected={isConnected}
          connectionChecked={connectionChecked}
          onRetry={checkConnection}
        />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ImageGenerator />} />
            <Route path="/video" element={<VideoGenerator />} />
            <Route path="/tools" element={<ImageTools />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App