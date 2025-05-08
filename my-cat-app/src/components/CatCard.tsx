import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Cat as CatType } from '../types/cat'
import { Heart } from 'lucide-react'

interface CatCardProps {
  cat: CatType
}

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  const navigate = useNavigate()

  const [isFavorite, setIsFavorite] = useState(cat.isfavorite)

  const handleClick = () => {
    navigate(`/cats/${cat.id}`)
  }

  // Toggle the favorite status and update the backend
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()

    // Toggle the isFavorite state
    const updatedFavoriteStatus = !isFavorite
    setIsFavorite(updatedFavoriteStatus)

    // Prepare the updated cat data
    const updatedCat = {
      ...cat,
      isfavorite: updatedFavoriteStatus, // Ensure the correct field name
      category: cat.category || '', // Set category to empty string if it's missing
      description: cat.description || '', // Set description to empty string if it's missing
      width: cat.width || 0, // Set width to 0 if it's missing
      height: cat.height || 0, // Set height to 0 if it's missing
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/cats/${cat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCat), // Send the updated data
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.cat.isfavorite) // Update the cat state with the updated data
      } else {
        throw new Error('Failed to update favorite status')
      }
    } catch (error) {
      console.error('Error updating favorite status:', error)
      // If the API call fails, revert the favorite status in the UI
      setIsFavorite(!updatedFavoriteStatus)
    }
  }

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-square">
        <img
          src={cat.image_url}
          alt={cat.name}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
          onClick={toggleFavorite}
        >
          {isFavorite ? (
            <Heart
              size={18}
              className="text-red-500 hover:text-gray-500 transition-colors"
            />
          ) : (
            <Heart
              size={18}
              className="text-gray-500 hover:text-red-500 transition-colors"
            />
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900">{cat.name}</h3>
        <p className="text-gray-500 text-sm mt-1">{cat.breed}</p>
      </div>
    </div>
  )
}

export default CatCard
