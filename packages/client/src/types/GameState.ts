export enum GameState {
  ini = 1,
  play = 2,
  paused = 3,
  stop = 4,
}

export type GameResult = {
  counts: number
  winner: boolean
}
