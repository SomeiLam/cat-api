import React from 'react'
import { Link } from 'react-router-dom'
import { Cat, User } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors"
          >
            <Cat size={28} strokeWidth={2} className="text-teal-600" />
            <span className="text-lg font-semibold hidden sm:inline">
              Cat Favorites
            </span>
          </Link>

          <h1 className="text-xl font-bold text-gray-900 sm:text-center absolute left-1/2 transform -translate-x-1/2 hidden sm:block">
            Cat Favorites
          </h1>

          <div className="flex items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="User profile"
            >
              <User size={24} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
