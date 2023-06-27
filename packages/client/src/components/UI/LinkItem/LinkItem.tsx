import { FC } from 'react'
import { NavLink } from 'react-router-dom'

import style from './linkItem.module.css'

interface ILinkItem {
  to: string
  text: string
}

const LinkItem: FC<ILinkItem> = ({ to, text }) => {
  return (
    <NavLink className={style.button} to={to}>
      {text}
    </NavLink>
  )
}

export default LinkItem
