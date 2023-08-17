export interface TopicsType {
  id: number
  name: string
  comments: {
    id: number
    user: {
      id: number
      userName: string
    }
    text: string
    date: string
  }[]
  author: {
    id: number
    userName: string
  }
  date: string
}
