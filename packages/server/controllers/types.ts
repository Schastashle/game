type stateMessage = {
  success: boolean
  message: string
}

type IComment = {
  topic_id?: number
  author_id?: number
  text?: string
  id?: number
  replies?: (number | IReply)[]
}

type IReply = {
  id?: number | null
  author_id?: number | null
  comment_id?: number | null
  text?: string | null
}

export { IComment, IReply, stateMessage }
