import { createSlice } from '@reduxjs/toolkit'
import { GameState, GameResult } from '../../../types/GameState'

type StateType = {
  gameState: GameState
  gameResult?: GameResult
  startTime?: number
}

const initialState: StateType = {
  gameState: GameState.ini,
}

const gameSlice = createSlice({
  name: 'gameSlice',
  initialState,
  reducers: {
    reset(state) {
      state.gameState = GameState.ini
      state.startTime = undefined
      state.gameResult = undefined
    },

    play(state, { payload }) {
      state.gameState = GameState.play
      state.startTime = payload.startTime
    },

    stop(state, { payload }) {
      state.gameState = GameState.stop
      state.gameResult = { ...payload.gameResult }
    },
  },
})

export default gameSlice
