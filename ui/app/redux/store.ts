import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/app/redux/slices/authSlice'
import galleryReducer from '@/app/redux/slices/gallerySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store