"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { LandingFormInterface } from "./_interfaces/landing/landingInterface";
import LoginForm from "@/app/_components/landing/loginForm";
import RegisterForm from "@/app/_components/landing/registerForm";
import { reauthUser } from '@/app/redux/slices/authSlice'
import { useAppDispatch } from '@/app/redux/hooks'

export default function Home() {
  const dispatch = useAppDispatch()
  const [triedReauth, setTriedReauth] = useState(false)

  useEffect(() => {
    if (!triedReauth) {
      dispatch(reauthUser())
      setTriedReauth(true)
    }
  }, [dispatch, triedReauth])
  
  const initialState: LandingFormInterface = {
    "email": "",
    "username": "",
    "password": "",
    "isLogin": false
  }

  const [form, setFormState] = useState<LandingFormInterface>(initialState)

  return (
      <div className="w-screen h-screen flex flex-row">
        <div className="bg-black h-screen w-1/2 flex flex-col justify-center items-center text-center p-5">
          <Image width={150} height={150} src="/logo.png" alt="AI Albumizer Logo" />
          <h1 className="font-bold text-white text-3xl">AI Albumizer</h1>
          <p className="text-white text-xl">Have A.I. Organize Your Photos!</p>
          <p className="text-white text-sm absolute bottom-10">Created By Dylan Rhinehart</p>
        </div>
        <div className="h-screen w-full flex justify-center items-center bg-center" style={{ backgroundImage: "url('/landing-bg.png')" }} >
          {
            form.isLogin ? <LoginForm form={form} setFormState={setFormState}/> : <RegisterForm form={form} setFormState={setFormState}/>
          }
        </div>
      </div>
  );
}
