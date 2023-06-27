import { ButtonHTMLAttributes, FC } from 'react'

import style from './button.module.css'

type ButtonElemPropsAttr = ButtonHTMLAttributes<HTMLButtonElement>

const Button: FC<ButtonElemPropsAttr> = ({ children, ...rest }) => {
  return (
    <button className={style.button} {...rest}>
      {children}
    </button>
  )
}

export default Button
