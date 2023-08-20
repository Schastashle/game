import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { logoutUser } from '../../store/slices/userSlice'

import styles from './home.module.css'
import SVGSpinner from '../../components/SVGSpinner/SVGSpinner'
import { IUser } from '../../types/IUser'

function getUserName(user: IUser | null) {
  return user ? user.login : 'Player'
}

const Home: FC = () => {
  const user = useAppSelector(state => state.user.user)
  const dispatch = useAppDispatch()

  const logoutHandler = () => {
    dispatch(logoutUser())
  }

  return (
    <section className={styles.home}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <SVGSpinner />
        </div>
        <h1 className={styles.title}>Three-in-row</h1>
        <div className={styles.username}>{getUserName(user)}</div>
        <NavLink to="/game" className={styles.link}>
          <div className={styles.start}>Старт</div>
        </NavLink>
        <div className={styles.btns}>
          <NavLink to="/profile">
            <div className={styles.minbtn}>Профиль</div>
          </NavLink>
          <NavLink to="/rating">
            <div className={styles.maxbtn}>Рекорды</div>
          </NavLink>
          <NavLink to="/forum">
            <div className={styles.minbtn}>Форум</div>
          </NavLink>
        </div>
        <button className={styles.logout} onClick={logoutHandler}>
          Выйти
        </button>
      </div>
    </section>
  )
}

// memo не нужен, на странице нет динамики
export default Home
