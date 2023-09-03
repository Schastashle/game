import { FC, ReactNode, useCallback, useEffect, memo } from 'react'
import style from './forumLayout.module.css'
import { NavLink } from 'react-router-dom'
import { transformDate } from '../../../../utils/dataTools'
import { Button, Input } from '../../../../components'
import Dialog from '../../../../components/UI/Dialog/Dialog'
import { useDialog } from '../../../../components/UI/Dialog/bll'
import { FieldValues, useForm } from 'react-hook-form'
import { ITopic } from '../../../../types/ForumTypes'
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks'
import { getAllTopics, setTopic } from '../../../../store/slices/forumSlice'

export interface ForumLayoutType {
  children: ReactNode | string
  id: number
}

function ForumLayout(props: ForumLayoutType) {
  const dispatch = useAppDispatch()
  const topics: ITopic[] = useAppSelector(state => state.forum.topics)
  const user = useAppSelector(state => state.user.user)
  const { children, id } = props

  useEffect(() => {
    dispatch(getAllTopics())
  }, [])

  const { isActive, onOpen, onClose } = useDialog()

  const addTopic = useCallback((name: string) => {
    if (user?.id && user?.login) {
      dispatch(
        setTopic({
          name,
          author_id: user.id,
          author_name: user.login,
        })
      )
    }
  }, [])

  // временное состояние для работы с мок данными добавления топика

  return (
    <div className={style.block}>
      <h1 className={style.title}>Форум игры</h1>

      <main className={style.main}>
        <article className={style.topic}>{children}</article>

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
            {topics.map(item => {
              return (
                <li key={item.topic_id} className={style.sidebarListItem}>
                  <div className={style.sidebarListItemTop}>
                    <div
                      className={style.sidebarListItemLink}
                      data-active={id === item.topic_id ? 1 : undefined}>
                      <NavLink to={`/forum/${item.topic_id}`}>
                        {item.name}
                      </NavLink>
                    </div>
                  </div>

                  <div className={style.sidebarListItemBottom}>
                    <p>
                      <span>{'Дата создания: '}</span>

                      <span>{transformDate(item.createdAt)}</span>
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </aside>
      </main>

      <ForumDialog addTopic={addTopic} isActive={isActive} onClose={onClose} />
    </div>
  )
}

type DialogProps = {
  isActive: boolean
  onClose: () => void
  addTopic: (name: string) => void
}

// надо тестировать после добавления интерактивностей на страницу форума
const ForumDialog: FC<DialogProps> = memo(({ isActive, onClose, addTopic }) => {
  const { register, handleSubmit, reset } = useForm()

  // добавление темы
  const handleAddTopic = useCallback(
    handleSubmit((data: FieldValues) => {
      addTopic(data.title)

      onClose()
    }),
    []
  )

  useEffect(() => {
    if (!isActive) reset()
  }, [isActive])

  return (
    <Dialog
      open={isActive}
      onClose={onClose}
      size={'middle'}
      key="addTopcDialog">
      <form className={style.modal} onSubmit={handleAddTopic}>
        <h3 className={style.modalTitle}>Создать новую тему</h3>

        <div className={style.modalInputBlock}>
          <Input {...register('title')} placeholder={'новая тема'} />
        </div>

        <div className={style.modalButtonBlock}>
          <Button
            type="submit"
            style={{
              width: '100%',
            }}>
            Создать
          </Button>
        </div>
      </form>
    </Dialog>
  )
})

export default memo(ForumLayout)
