import React, { FC, useEffect, useState, useCallback, memo } from 'react'
import { mockData } from '../index/mockData'
import { transformDate, transformTime } from '../../../utils/dataTools'
import style from './forumTopic.module.css'
import { Button, Input } from '../../../components/UI'
import { TopicsType } from '../../../types/ForumTypes'
import { useForm } from 'react-hook-form'

interface ForumTopicsProps {
  id: number
}

function findCallnack(id: number | undefined, item: TopicsType): boolean {
  return Number.isFinite(id) && item.id === id
}

function ForumTopic({ id }: ForumTopicsProps) {
  console.info('ForumTopic render')

  const [data, setData] = useState<TopicsType | undefined>(undefined)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    console.info('ForumTopic useEffect')

    const data = mockData.find(findCallnack.bind(null, Number(id)))
    setData(data)
  }, [id])

  const handleAddComment = useCallback(
    handleSubmit(data => {
      if (!data.comment) return

      setData(prevState => {
        if (!prevState) return undefined

        return {
          ...prevState,
          comments: [
            ...(prevState?.comments || []),
            createComments(data.comment),
          ],
        }
      })

      reset()
    }),
    []
  )

  if (!data) {
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
          <span>{'Тема: '}</span>

          <span>{data.name}</span>
        </h2>

        <div className={style.subTitle}>
          <span>{'Автор: '}</span>

          <span>{data.author?.userName}</span>
        </div>

        <div className={style.subTitle}>
          <span>{'Дата создания: '}</span>

          <span>{data.date ? transformDate(data.date) : ''}</span>
        </div>
      </div>

      <div className={style.comments}>
        <ul>
          {data.comments?.map(item => (
            <li key={`${id}-${item.id}`}>
              <div className={style.commentsLeft}>
                <div className={style.commentsAvatar}>
                  <img
                    src={'https://vibirai.ru/image/964470.jpg'}
                    alt="avatar"
                  />
                </div>

                <div className={style.commentsName}>{item.user.userName}</div>

                <div className={style.commentsDate}>
                  {`${transformDate(item.date)} ${transformTime(item.date)}`}
                </div>
              </div>

              <div className={style.commentsRight}>{item.text}</div>
            </li>
          ))}
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

function createComments(comment: string) {
  return {
    id: new Date().getTime(),
    text: comment,
    date: String(new Date()),
    user: {
      id: 1,
      userName: 'Курбан',
    },
  }
}

export default memo(ForumTopic)
