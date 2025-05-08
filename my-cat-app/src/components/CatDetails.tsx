import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Edit } from 'lucide-react'

const CatDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [cat, setCat] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch cat details
  useEffect(() => {
    const fetchCatDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/cats/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch cat data')
        }
        const data = await response.json()
        setCat(data.cat) // Assuming the response structure is { cat: { ... } }
      } catch (err) {
        console.log(err)
        setError('Failed to load cat details')
      } finally {
        setLoading(false)
      }
    }

    fetchCatDetails()
  }, [id])

  const toggleFavorite = async () => {
    const updatedCat = {
      ...cat,
      isfavorite: !cat.isfavorite, // Toggle the isfavorite value
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/cats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCat),
      })

      if (response.ok) {
        const data = await response.json()
        setCat(data.cat) // Update the cat state with the updated data
      } else {
        throw new Error('Failed to update favorite status')
      }
    } catch (err) {
      console.log(err)
      setError('Failed to update favorite status')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!cat) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cat not found</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-teal-600 hover:text-teal-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to gallery
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to gallery
      </button>

      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="relative">
          <img
            src={cat.image_url}
            alt={cat.name}
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm ${
                cat.isfavorite ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart
                size={24}
                className={`hover:text-red-500 transition-colors ${cat.isfavorite ? 'text-red-500' : ''}`}
              />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cat.name}</h1>
              <div className="mt-2 flex items-center space-x-4">
                <div>
                  <p className="text-sm text-gray-500">Breed</p>
                  <p className="font-medium">{cat.breed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">
                    {cat.age} {cat.age === 1 ? 'year' : 'years'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{cat.category}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/cats/${id}/edit`)}
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
            >
              <Edit size={18} className="mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">About</h2>
            <p className="text-gray-700">
              {cat.description || 'No description available'}
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Gallery
            </h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {cat.gallery?.map((imageUrl: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 rounded-md"
                >
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CatDetails
