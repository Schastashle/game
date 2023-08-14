import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  ILeaderboardData,
  ILeaderboardResponse,
} from '../../types/ILeaderboard'

const TEAM_NAME = 'FIAR'
const BASE_URL = 'https://ya-praktikum.tech/api/v2'

interface LeaderboardInitialState {
  status: string
  error: string | undefined
  leaderboard: ILeaderboardResponse[]
}

const initialState: LeaderboardInitialState = {
  status: '',
  error: '',
  leaderboard: [],
}

export const addUserToLeaderboard = createAsyncThunk<
  boolean,
  ILeaderboardData,
  { rejectValue: string }
>('leaderboard/addUserToLeaderboard', async (query, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/leaderboard`,
      {
        data: query,
        ratingFieldName: 'scoresFir',
        teamName: 'FIAR',
      },
      { withCredentials: true }
    )
    if (!response.request.status) {
      return rejectWithValue('Произошла ошибка отправки данных')
    }
    return false
  } catch (e) {
    return rejectWithValue('Произошла ошибка отправки данных')
  }
})

export const getLeaderboard = createAsyncThunk<
  ILeaderboardResponse[],
  undefined,
  { rejectValue: string }
>('leaderboard/getLeaderboard', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/leaderboard/all`,
      {
        ratingFieldName: 'scoresFir',
        cursor: 0,
        limit: 10,
      },
      { withCredentials: true }
    )
    if (!response.request.status) {
      return rejectWithValue('Произошла ошибка получения данных')
    }
    return response.data
  } catch (e) {
    return rejectWithValue('Произошла ошибка получения данных')
  }
})

export const getTeamLeaderboard = createAsyncThunk<
  ILeaderboardResponse[],
  undefined,
  { rejectValue: string }
>('leaderboard/getTeamLeaderboard', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/leaderboard/${TEAM_NAME}`,
      {
        ratingFieldName: 'scoresFir',
        cursor: 0,
        limit: 10,
      },
      { withCredentials: true }
    )
    if (!response.request.status) {
      return rejectWithValue('Произошла ошибка получения данных')
    }
    return response.data
  } catch (e) {
    return rejectWithValue('Произошла ошибка получения данных')
  }
})

const setLoading = (state: LeaderboardInitialState) => {
  state.status = 'loading'
  state.error = ''
}

const setRejected = (
  state: LeaderboardInitialState,
  action: PayloadAction<string | undefined>
) => {
  state.status = 'rejected'
  state.error = action.payload
}

export const leaderboardSlice = createSlice({
  name: 'leaderboardSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addUserToLeaderboard.pending, setLoading)
      .addCase(addUserToLeaderboard.rejected, setRejected)
      .addCase(addUserToLeaderboard.fulfilled, state => {
        state.status = 'resolve'
      })
      .addCase(getLeaderboard.pending, setLoading)
      .addCase(getLeaderboard.rejected, setRejected)
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.status = 'resolve'
        state.leaderboard = action.payload
      })
      .addCase(getTeamLeaderboard.pending, setLoading)
      .addCase(getTeamLeaderboard.rejected, setRejected)
      .addCase(getTeamLeaderboard.fulfilled, (state, action) => {
        state.status = 'resolve'
        state.leaderboard = action.payload
      })
  },
})

export default leaderboardSlice.reducer
