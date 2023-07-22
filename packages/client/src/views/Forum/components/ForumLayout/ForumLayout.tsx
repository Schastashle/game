import { FC, ReactNode, useCallback, useState } from 'react'
import style from './forumLayout.module.css'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { useDate } from '../../../../hooks/useDate'
import { Button, Input } from '../../../../components/UI'
import Dialog from '../../../../components/UI/Dialog/Dialog'
import { useDialog } from '../../../../components/UI/Dialog/bll'

interface ForumLayoutType {
  children: ReactNode | string
  topics: {
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
  }[]
}

const ForumLayout: FC<ForumLayoutType> = props => {
  const { children, topics } = props
  const { id } = useParams()

  const { getDate } = useDate()
  const { isActive, onOpen, onClose } = useDialog()
  const [newTopicName, setNewTopicName] = useState('')

  // временное состояние для работы с мок данными добавления топика
  const [list, setList] = useState(topics)

  const handleAddTopic = useCallback(() => {
    onClose()

    setList(prev => {
      return [
        ...prev,
        {
          id: new Date().getTime(),
          name: newTopicName,
          date: String(new Date()),
          comments: [],
          author: {
            id: 1,
            userName: 'Курбан',
          },
        },
      ]
    })

    setNewTopicName('')
  }, [list, newTopicName])

  return (
    <div className={style.block}>
      <h1 className={style.title}>Форум игры</h1>

      <main className={style.main}>
        <article className={style.topic}>
          {id ? (
            <>
              <Outlet />
            </>
          ) : (
            children
          )}
        </article>

        <aside className={style.sidebar}>
          <div className={style.sidebarHeader}>
            <h2 className={style.sidebarTitle}>Темы</h2>

            <div>
              <Button
                onClick={onOpen}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#458EE6',
                  borderRadius: '4px',
                }}>
                Новая тема
              </Button>
            </div>
          </div>

          <ul className={style.sidebarList}>
            {list.map(item => {
              return (
                <li key={item.id} className={style.sidebarListItem}>
                  <div className={style.sidebarListItemTop}>
                    <div
                      className={style.sidebarListItemLink}
                      data-active={Number(id) === item.id ? 1 : undefined}>
                      <NavLink to={`/forum/${item.id}`}>{item.name}</NavLink>
                    </div>

                    <div className={style.sidebarListItemCount}>
                      <div>{item.comments.length}</div>
                    </div>
                  </div>

                  <div className={style.sidebarListItemBottom}>
                    <p>
                      <span>{'Дата создания: '}</span>

                      <span>{getDate(item.date)}</span>
                    </p>

                    <p>
                      <span>{`Автор: `}</span>

                      <span>{item.author.userName}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </aside>
      </main>

      <Dialog open={isActive} onClose={onClose} size={'middle'}>
        <form className={style.modal} onSubmit={handleAddTopic}>
          <h3 className={style.modalTitle}>Создать новую тему</h3>

          <div className={style.modalInputBlock}>
            <Input
              name="title"
              placeholder={'новая тема'}
              value={newTopicName}
              onChange={e => {
                setNewTopicName(e.target.value)
              }}
            />
          </div>

          <div className={style.modalButtonBlock}>
            <Button
              disabled={!newTopicName}
              style={{
                width: '100%',
              }}>
              Создать
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

export default ForumLayout
