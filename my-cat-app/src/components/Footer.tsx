import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 py-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Cat Favorites. All rights reserved.
        </p>
        <div className="flex justify-center mt-4 space-x-6">
          <a
            href="#"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
