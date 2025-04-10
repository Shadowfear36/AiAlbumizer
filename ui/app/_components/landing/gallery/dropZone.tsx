'use client'
import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

interface DropzoneUploaderProps {
  onUpload: (files: File[]) => void
}

export default function DropzoneUploader({ onUpload }: DropzoneUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])

    const urls = acceptedFiles.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...urls])
  }, [])

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = () => {
    if (files.length > 0) {
      onUpload(files)
      setFiles([])
      previews.forEach((url) => URL.revokeObjectURL(url))
      setPreviews([])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: true,
  })

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 w-full ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white'
        } hover:border-blue-400 hover:bg-blue-50 cursor-pointer`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500 font-semibold">Drop the images here...</p>
        ) : (
          <>
            <p className="text-gray-600">Drag & drop your photos here</p>
            <p className="text-gray-400 text-sm">or click to browse</p>
          </>
        )}
      </div>

      {previews.length > 0 && (
        <>
          <div className="mt-4 w-full overflow-x-auto">
            <div className="flex gap-4 pb-2">
              {previews.map((src, index) => (
                <div key={index} className="relative w-24 h-24 flex-shrink-0 border rounded overflow-hidden">
                  <img src={src} alt={`preview-${index}`} className="object-cover w-full h-full" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Upload
          </button>
        </>
      )}
    </div>
  )
}
