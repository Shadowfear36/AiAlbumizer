'use client'

export default function PhotoModal({ image, onClose }: { image: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative max-w-[90%] max-h-[90%]">
        <img src={image} alt="Zoomed" className="max-w-full max-h-full rounded-lg shadow-lg" />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 shadow hover:bg-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
