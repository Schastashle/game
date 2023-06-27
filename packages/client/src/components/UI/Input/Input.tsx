import { FC, InputHTMLAttributes } from 'react'

import style from './input.module.css'

interface IInputProps {
  error?: string
}

type InputElemProps = InputHTMLAttributes<HTMLInputElement>

const Input: FC<IInputProps & InputElemProps> = ({ error, ...rest }) => {
  return (
    <label className={style.label}>
      <input className={style.input} {...rest} />
      <p className={error ? style.error : ''}>{error}</p>
    </label>
  )
}

export default Input
