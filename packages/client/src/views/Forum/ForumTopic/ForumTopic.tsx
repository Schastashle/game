import { FC, useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { mockData } from '../index/mockData'
import { useDate } from '../../../hooks/useDate'
import style from './forumTopic.module.css'
import { Button, Input } from '../../../components/UI'

const ForumTopic: FC = () => {
  const { id } = useParams()

  const data = useMemo(() => {
    if (id) {
      return mockData.find(item => item.id === Number(id))
    }
  }, [id])

  const [comments, setComments] = useState(data ? data.comments : [])

  const { getDate, getTime } = useDate()

  const [text, setText] = useState('')

  const handleAddComment = useCallback(() => {
    setComments(prevState => [
      ...prevState,
      {
        id: new Date().getTime(),
        text: text,
        date: String(new Date()),
        user: {
          id: 1,
          userName: 'Курбан',
        },
      },
    ])

    setText('')
  }, [comments, text])

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

          <span>{data.author.userName}</span>
        </div>

        <div className={style.subTitle}>
          <span>{'Дата создания: '}</span>

          <span>{getDate(data.date)}</span>
        </div>
      </div>

      <div className={style.comments}>
        <ul>
          {comments.map((item, key) => (
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
                  {`${getDate(item.date)} ${getTime(item.date)}`}
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
              onChange={e => {
                setText(e.target.value)
              }}
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

export default ForumTopic
