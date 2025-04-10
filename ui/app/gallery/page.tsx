'use client'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { fetchUserAlbums, fetchUserPhotos } from '@/app/redux/slices/gallerySlice'
import { useRouter } from 'next/navigation'
import DropzoneUploader from '../_components/landing/gallery/dropZone'
import UserMenu from '@/app/_components/landing/gallery/UserMenu'
import AlbumList from '@/app/_components/landing/gallery/AlbumList'
import PhotoGallery from '@/app/_components/landing/gallery/PhotoGallery'
import PhotoModal from '@/app/_components/landing/gallery/PhotoModal'

export default function GalleryPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { albums, photos, loading, error } = useAppSelector((state) => state.gallery)
  const router = useRouter()

  const [editAlbumId, setEditAlbumId] = useState<number | null>(null)
  const [albumNameInput, setAlbumNameInput] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (!user) router.push('/')
    else {
      dispatch(fetchUserAlbums())
      dispatch(fetchUserPhotos())
    }
  }, [user, dispatch, router])

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (res.ok) {
        dispatch(fetchUserPhotos())
        dispatch(fetchUserAlbums())
      } else {
        alert('Upload failed')
      }
    }
  }

  const handleSaveAlbumName = async (albumId: number) => {
    const res = await fetch(`http://localhost:8000/api/albums/${albumId}/`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: albumNameInput }),
    })
    if (res.ok) {
      setEditAlbumId(null)
      dispatch(fetchUserAlbums())
    } else alert('Failed to update album name')
  }

  const deletePhoto = async (photoId: number) => {
    const confirmed = confirm('Delete this photo?')
    if (!confirmed) return

    const res = await fetch(`http://localhost:8000/api/photos/${photoId}/`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (res.ok) dispatch(fetchUserPhotos())
    else alert('Failed to delete photo.')
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col items-center p-6 text-center bg-white">
      <UserMenu />
      <DropzoneUploader onUpload={handleUpload} />
      {loading && <p>Loading gallery...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <AlbumList
        albums={albums}
        editAlbumId={editAlbumId}
        albumNameInput={albumNameInput}
        setEditAlbumId={setEditAlbumId}
        setAlbumNameInput={setAlbumNameInput}
        handleSaveAlbumName={handleSaveAlbumName}
        handleEditAlbum={(id: number, name: string) => {
          setEditAlbumId(id)
          setAlbumNameInput(name)
        }}
      />

      <PhotoGallery photos={photos} onSelect={setSelectedPhoto} onDelete={deletePhoto} />

      {selectedPhoto && <PhotoModal image={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </div>
  )
}
