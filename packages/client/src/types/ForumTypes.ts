export interface ITopic {
  topic_id: number
  name: string
  author_id: number
  createdAt: string
  updatedAt: string
  comment: IComment[]
}

export interface IComment {
  comment_id: number
  author_id: number
  topic_id: number
  text: string
  createdAt: string
  updatedAt: string
}

export type QueryComment = {
  topic_id: number
  author_id: number
  text: string
}

export type QueryUpdateComment = {
  comment_id: string
  value: string
}

export type QueryTopic = {
  name: string
  author_id: number
  author_name: string
}
