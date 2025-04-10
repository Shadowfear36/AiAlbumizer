'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function AlbumPage() {
  const { id } = useParams()
  const router = useRouter()
  const [faces, setFaces] = useState([])
  const [selectedFace, setSelectedFace] = useState(null)

  const fetchFaces = async () => {
    const res = await fetch(`http://localhost:8000/api/albums/${id}/faces/`, {
      credentials: 'include',
    })
    const data = await res.json()
    setFaces(data)
  }

  useEffect(() => {
    fetchFaces()
  }, [id])

  const deleteFace = async (faceId: number) => {
    const confirmed = confirm('Are you sure you want to delete this image from the album?')
    if (!confirmed) return

    const res = await fetch(`http://localhost:8000/api/faces/${faceId}/`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.ok) {
      setFaces((prev) => prev.filter((face) => face.id !== faceId))
    } else {
      alert('Failed to remove image from album.')
    }
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8">
      <button
        className="mb-6 text-blue-600 hover:underline font-medium"
        onClick={() => router.push('/gallery')}
      >
        ← Back to Gallery
      </button>

      <h1 className="text-2xl font-bold mb-6">Faces in Album #{id}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {faces.map((face) => (
          <div key={face.id} className="relative group rounded overflow-hidden shadow border">
            <img
              src={face.photo_url}
              alt={`Face ${face.id}`}
              className="w-full h-auto object-cover aspect-square cursor-pointer"
              onClick={() => setSelectedFace(face)}
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              onClick={() => deleteFace(face.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Image Popup Modal */}
      {selectedFace && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative max-w-[90%] max-h-[90%]">
            <img
              src={selectedFace.photo_url}
              alt="Zoomed Face"
              className="max-w-full max-h-full rounded-lg shadow-lg"
            />
            <button
              onClick={() => setSelectedFace(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 shadow hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
