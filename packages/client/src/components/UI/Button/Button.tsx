import { ButtonHTMLAttributes, FC } from 'react'

import style from './button.module.css'

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  transparent?: boolean
}

const Button: FC<IButtonProps> = ({ children, transparent, ...rest }) => {
  return (
    <button
      className={`${style.button} ${transparent ? style.transparent : ''}`}
      {...rest}>
      {children}
    </button>
  )
}

export default Button
