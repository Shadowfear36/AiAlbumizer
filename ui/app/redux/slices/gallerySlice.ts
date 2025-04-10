// app/redux/slices/gallerySlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '@/app/redux/utils/axios'

export const fetchUserAlbums = createAsyncThunk('gallery/fetchAlbums', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/albums/')
    return res.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Error fetching albums')
  }
})

export const fetchUserPhotos = createAsyncThunk('gallery/fetchPhotos', async (_, thunkAPI) => {
  try {
    const res = await axios.get('/photos/')
    return res.data
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data || 'Error fetching photos')
  }
})

interface GalleryState {
  albums: any[]
  photos: any[]
  loading: boolean
  error: string | null
}

const initialState: GalleryState = {
  albums: [],
  photos: [],
  loading: false,
  error: null,
}

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Albums
      .addCase(fetchUserAlbums.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserAlbums.fulfilled, (state, action) => {
        state.albums = action.payload
        state.loading = false
      })
      .addCase(fetchUserAlbums.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })

      // Photos
      .addCase(fetchUserPhotos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserPhotos.fulfilled, (state, action) => {
        state.photos = action.payload
        state.loading = false
      })
      .addCase(fetchUserPhotos.rejected, (state, action) => {
        state.error = action.payload as string
        state.loading = false
      })
  },
})

export default gallerySlice.reducer
