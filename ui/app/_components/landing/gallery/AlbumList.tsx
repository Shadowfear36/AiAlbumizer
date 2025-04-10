'use client'
import { useRouter } from 'next/navigation'

export default function AlbumList({ albums, editAlbumId, albumNameInput, setEditAlbumId, setAlbumNameInput, handleSaveAlbumName, handleEditAlbum }: any) {
  const router = useRouter()

  return (
    <div className="w-full mb-6 mt-5">
      <h2 className="text-xl font-semibold mb-2">Albums</h2>
      <ul className="flex flex-row gap-4 overflow-x-auto px-2 py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {albums.map((album: any) => (
          <li
            key={album.id}
            className="group min-w-[150px] h-[190px] rounded-lg shadow-md overflow-hidden relative cursor-pointer flex flex-col items-center"
            onClick={() => router.push(`/album/${album.id}`)}
          >
            {album.thumbnail_url ? (
              <img src={album.thumbnail_url} alt={`Album ${album.cluster_id}`} className="object-cover w-full h-[150px]" />
            ) : (
              <div className="w-full h-[150px] flex items-center justify-center bg-gray-300 text-gray-600">No Image</div>
            )}
            <div className="w-full px-2 py-1 text-sm flex items-center justify-center relative">
              {editAlbumId === album.id ? (
                <input
                  className="border border-gray-300 rounded px-2 w-full"
                  value={albumNameInput}
                  onChange={(e) => setAlbumNameInput(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={() => handleSaveAlbumName(album.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveAlbumName(album.id)}
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-1 justify-center w-full" onClick={(e) => e.stopPropagation()}>
                  <span className="truncate">{album.name || 'Unnamed Album'}</span>
                  <button
                    className="hidden group-hover:inline text-xs text-blue-500 ml-1"
                    onClick={() => handleEditAlbum(album.id, album.name || '')}
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
