import { FC, InputHTMLAttributes } from 'react'
import style from './input.module.css'
import { UseFormRegister, FieldValues } from 'react-hook-form'
interface IInputProps {
  error?: string
  register?: UseFormRegister<FieldValues>
  name: string
}

type InputElemProps = InputHTMLAttributes<HTMLInputElement>

const Input: FC<IInputProps & InputElemProps> = ({
  error,
  register,
  name,
  ...rest
}) => {
  return (
    <label className={style.label}>
      <input
        className={style.input}
        {...(register && { ...register(name) })}
        {...rest}
      />
      {error && <p className={style.error}>{error}</p>}
    </label>
  )
}

export default Input
