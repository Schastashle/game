import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import {
  ITopic,
  QueryComment,
  QueryTopic,
  QueryUpdateComment,
} from '../../types/ForumTypes'
import { PUBLISH_URL } from '../../shared/constants'

const BASE_URL = `${PUBLISH_URL}/forum/v1/`
const DEFAULT_ERROR = 'Произошла ошибка отправки данных'

export interface IForumInitialState {
  status: string
  error: string | undefined
  topics: ITopic[]
  topic: ITopic | null
}

const initialState: IForumInitialState = {
  status: '',
  error: '',
  topics: [],
  topic: null,
}

export const getTopic = createAsyncThunk<
  ITopic,
  number,
  { rejectValue: string }
>('forum/getTopic', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}topic`, {
      params: { id },
      withCredentials: true,
    })
    if (!response.request.status) {
      return rejectWithValue(DEFAULT_ERROR)
    }
    return response.data.topic
  } catch (e) {
    return rejectWithValue(DEFAULT_ERROR)
  }
})

export const setTopic = createAsyncThunk<
  boolean,
  QueryTopic,
  { rejectValue: string }
>('forum/setTopic', async (query, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(`${BASE_URL}topic`, query, {
      withCredentials: true,
    })
    if (!response.request.status) {
      return rejectWithValue(DEFAULT_ERROR)
    }
    dispatch(getAllTopics())
    return true
  } catch (e) {
    return rejectWithValue(DEFAULT_ERROR)
  }
})

export const createComment = createAsyncThunk<
  boolean,
  QueryComment,
  { rejectValue: string }
>('forum/createComment', async (query, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(`${BASE_URL}comment`, query, {
      withCredentials: true,
    })
    if (!response.request.status) {
      return rejectWithValue(DEFAULT_ERROR)
    }
    dispatch(getTopic(query.topic_id))
    return true
  } catch (e) {
    return rejectWithValue(DEFAULT_ERROR)
  }
})

export const updateComment = createAsyncThunk<
  boolean,
  QueryUpdateComment,
  { rejectValue: string }
>('forum/updateComment', async (query, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}comment`, query, {
      withCredentials: true,
    })
    if (!response.request.status) {
      return rejectWithValue(DEFAULT_ERROR)
    }
    return true
  } catch (e) {
    return rejectWithValue(DEFAULT_ERROR)
  }
})

export const getAllTopics = createAsyncThunk<
  ITopic[],
  undefined,
  { rejectValue: string }
>('forum/getAllTopics', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}topics`, {
      withCredentials: true,
    })
    if (!response.request.status) {
      return rejectWithValue(DEFAULT_ERROR)
    }
    return response.data
  } catch (e) {
    return rejectWithValue(DEFAULT_ERROR)
  }
})

const setLoading = (state: IForumInitialState) => {
  state.status = 'loading'
  state.error = ''
}

const setRejected = (
  state: IForumInitialState,
  action: PayloadAction<string | undefined>
) => {
  state.status = 'rejected'
  state.error = action.payload
}

export const leaderboardSlice = createSlice({
  name: 'forumSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllTopics.pending, setLoading)
      .addCase(getAllTopics.rejected, setRejected)
      .addCase(getAllTopics.fulfilled, (state, action) => {
        state.status = 'resolve'
        state.topics = action.payload.reverse()
      })
      .addCase(getTopic.pending, setLoading)
      .addCase(getTopic.rejected, setRejected)
      .addCase(getTopic.fulfilled, (state, action) => {
        state.status = 'resolve'
        state.topic = action.payload
      })
  },
})

export default leaderboardSlice.reducer
