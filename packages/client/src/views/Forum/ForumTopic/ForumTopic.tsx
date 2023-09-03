import React, { useEffect, useCallback, memo } from 'react'
import { transformDate, transformTime } from '../../../utils/dataTools'
import style from './forumTopic.module.css'
import { Button, Input } from '../../../components/UI'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks'
import { createComment, getTopic } from '../../../store/slices/forumSlice'

interface ForumTopicsProps {
  id: number
}

function ForumTopic({ id }: ForumTopicsProps) {
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useAppDispatch()
  const topic = useAppSelector(state => state.forum.topic)
  const user = useAppSelector(state => state.user.user)

  useEffect(() => {
    dispatch(getTopic(id))
  }, [id])

  const handleAddComment = useCallback(
    handleSubmit(data => {
      if (!data.comment) return
      console.log(topic?.topic_id && user?.id)
      if (topic?.topic_id && user?.id) {
        dispatch(
          createComment({
            topic_id: topic.topic_id,
            author_id: user.id,
            text: data.comment,
          })
        )
      }

      reset()
    }),
    []
  )

  if (!topic?.topic_id) {
    return (
      <div>
        <h3 className={style.title}>Такой темы не найдено</h3>
      </div>
    )
  }

  return (
    <div className={style.topic}>
      <div>
        <h2 className={style.title}>
          <div className={style.sidebarListItemCount}>
            <div>{topic.comment.length}</div>
          </div>
          <span>{'Тема: '}</span>

          <span>{topic.name}</span>
        </h2>

        <div className={style.subTitle}>
          <span>{'Дата создания: '}</span>

          <span>{topic.createdAt ? transformDate(topic.createdAt) : ''}</span>
        </div>
      </div>

      <div className={style.comments}>
        <ul>
          {topic &&
            topic.comment?.map(item => {
              return (
                <li key={`${id}-${item.comment_id}`}>
                  <div className={style.commentsLeft}>
                    <div className={style.commentsDate}>
                      {`${transformDate(item.createdAt)} ${transformTime(
                        item.createdAt
                      )}`}
                    </div>
                  </div>

                  <div className={style.commentsRight}>{item.text}</div>
                </li>
              )
            })}
        </ul>
      </div>

      <div className={style.form}>
        <form onSubmit={handleAddComment}>
          <div className={style.formInputBlock}>
            <Input {...register('comment')} placeholder={'ввод'} />
          </div>

          <div className={style.formButtonBlock}>
            <Button
              style={{
                height: '45px',
              }}>
              Отправить
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(ForumTopic)
