import { FC, useMemo, useEffect } from 'react'
import style from './rating.module.css'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { getLeaderboard } from '../../store/slices/leaderboardSlice'

import ImgGold from '../../assets/img_gold-medal.png'
import ImgSilver from '../../assets/img_silver-medal.png'
import ImgBronze from '../../assets/img_bronze-medal.png'
import ImgRating from '../../assets/img_rating.png'
import { NavLink } from 'react-router-dom'

const Rating: FC = () => {
  const { user } = useAppSelector(state => state.user)
  const { leaderboard } = useAppSelector(state => state.leaderboard)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user?.login) {
      dispatch(getLeaderboard())
    }
  }, [])

  const medals = useMemo(() => {
    return [ImgGold, ImgSilver, ImgBronze]
  }, [])

  return (
    <div className={style.block}>
      <NavLink to="/">
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
      <div className={style.ratingImg}>
        <img src={ImgRating} alt={'Рейтинг'} />
      </div>

      <h1 className={style.title}>Рейтинг игроков</h1>

      <div>
        <div className={style.header}>
          <div className={style.headerNum}>Место</div>

          <div className={style.headerName}>Имя пользователя</div>

          <div className={style.headerResult}>Результат</div>
        </div>

        <ul className={style.list}>
          {leaderboard.map((record, index) => {
            return (
              <li key={record.data.userId} className={style.listItem}>
                <div className={style.listItemNum}>
                  {medals[index] ? (
                    <img
                      className={style.medals}
                      src={medals[index]}
                      alt="medal"
                    />
                  ) : (
                    index + 1
                  )}
                </div>

                <div className={style.listItemName}>{record.data.userName}</div>

                <div className={style.listItemScores}>
                  {record.data.scoresFir}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Rating
