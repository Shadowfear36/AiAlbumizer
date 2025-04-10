'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterFormProps } from '@/app/_interfaces/landing/landingInterface'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks'
import { registerUser } from '@/app/redux/slices/authSlice'
import { AuthState } from "@/app/redux/slices/authSlice"

function RegisterForm({ form, setFormState }: RegisterFormProps) {
  const dispatch = useAppDispatch()
  const { user, loading, error }: AuthState = useAppSelector((state) => state.auth)
  const router = useRouter()

  const onRegister = () => {
    dispatch(registerUser({
      username: form.username,
      email: form.email,
      password: form.password,
    }))
  }

  useEffect(() => {
    if (user) {
      router.push('/gallery')
    }
  }, [user, router])

  return (
    <>
      <button
        className="absolute top-5 right-5 font-bold p-2 hover:cursor-pointer hover:bg-black hover:text-white bg-gray-200 rounded-lg"
        onClick={() => setFormState({ ...form, isLogin: true })}
      >
        Login
      </button>

      <div className="w-1/3 h-1/3 flex text-center flex-col items-center p-5 justify-center bg-black rounded-lg">
        <h2 className="font-bold text-4xl p-3 text-white">Let's Get Started</h2>
        <input
          type="text"
          placeholder="Username"
          className="text-center rounded-lg bg-gray-100 p-2 m-1 w-1/2"
          value={form.username}
          onChange={(e) => setFormState({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="E-Mail"
          className="text-center rounded-lg bg-gray-100 p-2 m-1 w-1/2"
          value={form.email}
          onChange={(e) => setFormState({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="text-center rounded-lg bg-gray-100 p-2 m-1 w-1/2"
          value={form.password}
          onChange={(e) => setFormState({ ...form, password: e.target.value })}
        />

        <button
          className="bg-black rounded-lg pt-2 pb-2 pr-5 pl-5 w-1/3 m-1 text-white hover:text-black hover:bg-white hover:pointer hover:cursor-pointer hover:border-1 hover:border-black"
          onClick={onRegister}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </>
  )
}

export default RegisterForm
