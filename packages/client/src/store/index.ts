import { configureStore } from '@reduxjs/toolkit'
import gameSlice from './slices/gameSlice'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    game: gameSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
