export interface ILeaderboardData {
  userId: number
  userName: string
  scoresFir: number
}

export interface ILeaderboardQuery {
  data: ILeaderboardData
  ratingFieldName: string
  teamName: string
}

export interface IGetLeaderboard {
  ratingFieldName: string
  cursor: number
  limit: number
}

export interface ILeaderboardResponse {
  data: ILeaderboardData
}
