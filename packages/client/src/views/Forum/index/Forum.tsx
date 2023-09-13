import ForumTopic from '../ForumTopic'
import ForumLayout from '../components/ForumLayout/ForumLayout'
import { NavLink, useParams } from 'react-router-dom'
import styles from './forum.module.css'

export default function Forum() {
  const { id } = useParams()
  const intId = id ? Number.parseInt(id) : NaN

  return (
    <>
      <NavLink to="/" className={styles.link}>
        <svg
          width="35"
          height="35"
          viewBox="0 0 35 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect width="35" height="35" rx="17.5" fill="#E61C5D" />
          <path
            d="M26 19C26.5523 19 27 18.5523 27 18C27 17.4477 26.5523 17 26 17L26 19ZM9.29289 17.2929C8.90237 17.6834 8.90237 18.3166 9.29289 18.7071L15.6569 25.0711C16.0474 25.4616 16.6805 25.4616 17.0711 25.0711C17.4616 24.6805 17.4616 24.0474 17.0711 23.6569L11.4142 18L17.0711 12.3431C17.4616 11.9526 17.4616 11.3195 17.0711 10.9289C16.6805 10.5384 16.0474 10.5384 15.6569 10.9289L9.29289 17.2929ZM26 17L10 17L10 19L26 19L26 17Z"
            fill="white"
          />
        </svg>
      </NavLink>
      <ForumLayout id={intId}>
        {isNaN(intId) && <h2>Выберите тему</h2>}
        {!isNaN(intId) && <ForumTopic id={intId} />}
      </ForumLayout>
    </>
  )
}
