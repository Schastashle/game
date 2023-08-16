import React, { FC, useEffect, useState, useCallback, memo } from 'react'
import { useParams } from 'react-router-dom'
import { mockData } from '../index/mockData'
import { transformDate, transformTime } from '../../../utils/dataTools'
import style from './forumTopic.module.css'
import { Button, Input } from '../../../components/UI'

type DataType = {
  id?: number
  name?: string
  comments?: {
    id: number
    user: {
      id: number
      userName: string
    }
    text: string
    date: string
  }[]
  author?: {
    id: number
    userName: string
  }
  date?: string
}

function findCallnack(id: string | undefined, item: DataType): boolean {
  return item.id === Number(id)
}

function ForumTopic() {
  const { id } = useParams()
  const [data, setData] = useState<DataType>({})
  const [text, setText] = useState('')

  useEffect(() => {
    const data = mockData.find(findCallnack.bind(null, id))
    if (data) setData(data)
  })

  const handleAddComment = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault()

      setData(prevState => ({
        ...prevState,
        comments: [
          ...(prevState.comments || []),
          {
            id: new Date().getTime(),
            text,
            date: String(new Date()),
            user: {
              id: 1,
              userName: 'Курбан',
            },
          },
        ],
      }))

      setText('')
    },
    [text]
  )

  const onChangeText = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setText(evt.target.value)
    },
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
          {data.comments?.map((item, key) => (
            <li key={key}>
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
            <Input
              name="comment"
              placeholder={'ввод'}
              value={text}
              onChange={onChangeText}
            />
          </div>

          <div className={style.formButtonBlock}>
            <Button
              disabled={!text}
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
