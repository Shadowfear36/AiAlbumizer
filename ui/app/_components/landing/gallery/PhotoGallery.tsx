'use client'

export default function PhotoGallery({ photos, onSelect, onDelete }: any) {
  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Photos</h2>
      <div className="flex flex-row gap-4 overflow-x-auto px-2 py-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {photos.map((photo: any) => (
          <div
            key={photo.id}
            className="min-w-[200px] h-[200px] rounded-lg overflow-hidden border shadow-sm relative group cursor-pointer"
            onClick={() => onSelect(photo.image_base64)}
          >
            <img src={photo.image_base64} alt="User Photo" className="object-cover w-full h-full" />
            <button
              className="absolute top-1 right-1 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(photo.id)
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
