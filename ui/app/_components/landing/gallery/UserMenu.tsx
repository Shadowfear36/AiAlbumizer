'use client'
import { useRef, useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { useRouter } from 'next/navigation'
import { logout } from '@/app/redux/slices/authSlice'

export default function UserMenu() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [visible, setVisible] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="absolute top-4 right-6 z-50" ref={menuRef}>
      <div className="relative">
        <button
          onClick={() => setVisible(!visible)}
          className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-white hover:text-black"
        >
          {user?.username}
        </button>

        {visible && (
          <div className="absolute right-0 mt-2 w-40 bg-white border shadow-md rounded-md">
            <button
              onClick={() => {
                dispatch(logout())
                router.push('/')
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
