import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Video, Grid } from 'lucide-react'
import runwareLogo from '../assets/runware-logo.png'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Image Generator', icon: Camera },
    { path: '/video', label: 'Video Generator', icon: Video },
    { path: '/gallery', label: 'Gallery', icon: Grid },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={runwareLogo} alt="Runware" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-xl text-gray-900">
              Runware Showcase
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar