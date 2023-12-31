import axios, { AxiosError } from 'axios'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser, IUserLogin, IUserSignup } from '../../types/IUser'
import { YA_API_URL } from '../../shared/constants'
import { loginWithCode } from '../../api/OAuth'

export interface IUserState {
  user: IUser | null
  status: string
  error: string | undefined
  isAuth: boolean
}

const initialState: IUserState = {
  user: null,
  status: '',
  error: '',
  isAuth: false,
}

interface IUserService {
  getCurrentUser(): Promise<IUser>
}

export const signupUser = createAsyncThunk<
  boolean,
  IUserSignup,
  { rejectValue: string }
>('user/signupUser', async (query, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${YA_API_URL}/auth/signup`, query, {
      withCredentials: true,
    })

    return true
  } catch (e) {
    return rejectWithValue('Произошла ошибка регистрации')
  }
})

export const signinUser = createAsyncThunk<
  boolean,
  IUserLogin,
  { rejectValue: string }
>('user/signinUser', async (query, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${YA_API_URL}/auth/signin`, query, {
      withCredentials: true,
    })

    return true
  } catch (e) {
    return rejectWithValue(`Произошла ошибка авторизации ${e}`)
  }
})

export const loginWithOAuth = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('user/loginWithOAuth', async (code, { rejectWithValue, dispatch }) => {
  let isOk = false
  try {
    const response = await loginWithCode(code)
    isOk = response?.data === 'OK'
    if (!isOk) throw new Error('Неизвестный ответ от oauth ' + response?.data)
  } catch (e) {
    return rejectWithValue(`Произошла ошибка авторизации OAuth ${e}`)
  }

  if (isOk) dispatch(getUser())
})

export const getUser = createAsyncThunk<
  IUser,
  undefined,
  { rejectValue: string }
>('user/getUser', async (_, thunkApi) => {
  const service: IUserService = thunkApi.extra as IUserService

  try {
    return service.getCurrentUser()
  } catch (e) {
    return thunkApi.rejectWithValue(
      `Произошла ошибка получения данных пользователя ${e}`
    )
  }
})

export const logoutUser = createAsyncThunk<
  boolean,
  undefined,
  { rejectValue: string }
>('user/logoutUser', async (_, { rejectWithValue }) => {
  let error
  try {
    await axios.post(`${YA_API_URL}/auth/logout`, {}, { withCredentials: true })
  } catch (e) {
    if (!axios.isAxiosError(e) || 401 !== e.response?.status) {
      error = e
    }
  }

  if (error) rejectWithValue(`Произошла ошибка выхода из системы ${error}`)
  return false
})

const setLoading = (state: IUserState) => {
  state.status = 'loading'
  state.error = ''
}

const setRejected = (
  state: IUserState,
  action: PayloadAction<string | undefined>
) => {
  state.status = 'rejected'
  state.error = action.payload
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    preloadState: (state: IUserState, action: PayloadAction<IUserState>) => {
      state = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signinUser.pending, setLoading)
      .addCase(signinUser.rejected, setRejected)
      .addCase(signinUser.fulfilled, (state, action) => {
        state.isAuth = action.payload
        state.error = ''
        state.status = 'resolve'
      })
      .addCase(signupUser.pending, setLoading)
      .addCase(signupUser.rejected, setRejected)
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isAuth = action.payload
        state.error = ''
        state.status = 'resolve'
      })
      .addCase(getUser.pending, setLoading)
      .addCase(getUser.rejected, setRejected)
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuth = true
        state.error = ''
        state.status = 'resolve'
      })
      .addCase(logoutUser.pending, setLoading)
      .addCase(logoutUser.rejected, setRejected)
      .addCase(logoutUser.fulfilled, state => {
        state.user = null
        state.isAuth = false
        state.error = ''
        state.status = 'resolve'
      })
  },
})

export default userSlice.reducer
