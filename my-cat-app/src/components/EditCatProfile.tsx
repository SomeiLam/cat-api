import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Cat } from '../types/cat'
import { ArrowLeft } from 'lucide-react'

const EditCatProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Initialize form data with default values to avoid null in the value props
  const [formData, setFormData] = useState<Cat>({
    id: '',
    name: '',
    breed: '',
    age: 0,
    category: '',
    image_url: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch cat data when the component mounts
  useEffect(() => {
    const fetchCatDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/cats/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch cat data')
        }
        const data = await response.json()
        setFormData({
          ...data.cat,
          name: data.cat.name || '', // Ensuring empty strings for optional fields
          breed: data.cat.breed || '',
          category: data.cat.category || '',
          description: data.cat.description || '',
        })
      } catch (err) {
        setError('Failed to load cat details')
      } finally {
        setLoading(false)
      }
    }

    fetchCatDetails()
  }, [id])

  // Handle input field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value, // Ensure valid integer for age
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/cats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: formData.age || 0, // Ensure age is valid
          category: formData.category || '', // Ensure category is valid
          width: formData.width || 0, // Ensure width is valid (if it's used in your backend)
          height: formData.height || 0, // Ensure height is valid (if it's used in your backend)
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cat data')
      }

      await response.json()
      navigate(`/cats/${id}`)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update cat profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(`/cats/${id}`)}
        className="inline-flex items-center text-teal-600 hover:text-teal-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to profile
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="aspect-square max-w-md mx-auto mb-8 rounded-lg overflow-hidden">
              <img
                src={
                  formData.image_url ||
                  'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg'
                }
                alt="Cat preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="image_url"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''} // Ensure it is never null
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="https://example.com/cat-image.jpg"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''} // Ensure it is never null
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Enter cat's name"
                />
              </div>

              <div>
                <label
                  htmlFor="breed"
                  className="block text-sm font-medium text-gray-700"
                >
                  Breed{' '}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={formData.breed || ''} // Ensure it is never null
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Enter breed"
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age || ''} // Ensure it is never null
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category{' '}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category || ''} // Ensure it is never null
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="e.g., Boxes, Hats, etc."
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description{' '}
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''} // Ensure it is never null
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="Enter a description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/cats/${id}`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCatProfile
