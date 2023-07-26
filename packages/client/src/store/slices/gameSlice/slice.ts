import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  counts: 0,
  level: 1,
  timer: null as number | null,
}

const gameSlice = createSlice({
  name: 'gameSlice',
  initialState,
  reducers: {
    setCounts: (state, { payload }) => {
      state.counts = payload
    },

    setTimer: (state, { payload }) => {
      state.timer = payload
    },
  },
})

export default gameSlice
