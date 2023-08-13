import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice'
import { gameSlice } from './slices/gameSlice'
import leaderboardSlice from './slices/leaderboardSlice'

export const store = configureStore({
  reducer: {
    user: userSlice,
    game: gameSlice.reducer,
    leaderboard: leaderboardSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
