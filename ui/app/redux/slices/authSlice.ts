import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import api from '@/app/redux/utils/axios'

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:8000/api/token/', credentials, {
        withCredentials: true,
      })
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    formData: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post('http://localhost:8000/api/register/', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Registration failed')
    }
  }
)

export const reauthUser = createAsyncThunk('auth/reauthUser', async (_, thunkAPI) => {
  try {
    // This will use cookies (e.g. refresh token) because of withCredentials
    const refreshResponse = await api.post('/token/refresh/')

    if (refreshResponse.status === 200) {
      // Now fetch the user info (you can replace this with a proper `/me/` endpoint)
      const res = await api.get('/users/')
      return res.data[0]
    }
  } catch (err: any) {
    return thunkAPI.rejectWithValue('Auto reauthentication failed')
  }
})

export interface AuthState {
  user: any
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(reauthUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(reauthUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(reauthUser.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.error = action.payload as string
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
