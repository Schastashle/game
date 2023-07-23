import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import { gameSlice } from './slices/gameSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    game: gameSlice.reducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
