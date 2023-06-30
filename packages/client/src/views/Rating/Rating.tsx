import { FC, useMemo } from 'react'
import style from './rating.module.css'
import { mockData } from './mockData'
import Avatar from '../../components/UI/Avatar/Avatar'
import ImgGold from '../../assets/img_gold-medal.png'
import ImgSilver from '../../assets/img_silver-medal.png'
import ImgBronze from '../../assets/img_bronze-medal.png'
import ImgRating from '../../assets/img_rating.png'

const Rating: FC = () => {
  const medals = useMemo(() => {
    return [ImgGold, ImgSilver, ImgBronze]
  }, [])

  return (
    <div className={style.block}>
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
          {mockData.map((item, key) => {
            return (
              <li key={item.id} className={style.listItem}>
                <div className={style.listItemNum}>
                  {medals[key] ? (
                    <img
                      className={style.medals}
                      src={medals[key]}
                      alt="medal"
                    />
                  ) : (
                    key + 1
                  )}
                </div>

                <div className={style.listItemAvatar}>
                  <Avatar src={item.avatarUrl} size={'medium'} />
                </div>

                <div
                  className={style.listItemName}
                  data-active={item.id === 2 ? 1 : undefined}>
                  {item.userName}
                </div>

                <div
                  className={style.listItemScores}
                  data-active={item.id === 2 ? 1 : undefined}>
                  {item.scores}
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
