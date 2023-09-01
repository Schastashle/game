import { configureStore } from '@reduxjs/toolkit'
import userSlice, { IUserState } from './slices/userSlice'
import { gameSlice } from './slices/gameSlice'
import type { UserService } from '../api/userService'
import { IGameState } from './slices/gameSlice/slice'
import leaderboardSlice, { ILeaderboardState } from './slices/leaderboardSlice'
import forumSlice, { IFornmInitialState } from './slices/forumSlice'

export interface IAppState {
  user: IUserState
  game: IGameState
  leaderboard: ILeaderboardState
  forum: IFornmInitialState
}
export const createStore = (
  service: UserService,
  preloadedState?: IAppState
) => {
  return configureStore({
    reducer: {
      user: userSlice,
      game: gameSlice.reducer,
      leaderboard: leaderboardSlice,
      forum: forumSlice,
    },
    preloadedState,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: service,
        },
      })
    },
  })
}

export type AppDispatch = ReturnType<typeof createStore>['dispatch']
export type RootState = IAppState
