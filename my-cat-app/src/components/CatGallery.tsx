import React, { useState, useEffect } from 'react'
import CatCard from './CatCard'

const CatGallery: React.FC = () => {
  const [visibleCats, setVisibleCats] = useState(4)
  const [cats, setCats] = useState<any[]>([]) // state to hold fetched cat data
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch cats data from the /cats endpoint when the component mounts
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/cats') // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch cats data')
        }
        const data = await response.json()
        setCats(data.cats) // Assuming the response structure is { cats: [...] }
      } catch (err) {
        setError('Failed to load cats data')
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCats()
  }, [])

  const loadMore = () => {
    setVisibleCats((prev) => Math.min(prev + 4, cats.length))
  }

  if (loading) {
    return <div>Loading...</div> // Show loading text or spinner while fetching
  }

  if (error) {
    return <div>{error}</div> // Show error message if fetching fails
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Explore Cats</h2>
        <div className="flex space-x-2">
          {/* Placeholder for filter/sort controls */}
          <select className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm">
            <option>All Categories</option>
            <option>Boxes</option>
            <option>Hats</option>
            <option>Toys</option>
            <option>Sunbathing</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cats.slice(0, visibleCats).map((cat) => (
          <CatCard key={cat.id} cat={cat} isFavorite={cat.isfavorite} />
        ))}
      </div>

      {visibleCats < cats.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors shadow-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default CatGallery
