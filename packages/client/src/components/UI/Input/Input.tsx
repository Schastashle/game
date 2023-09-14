import style from './input.module.css'
import { FC, InputHTMLAttributes, forwardRef } from 'react'
import { UseFormRegister, FieldValues } from 'react-hook-form'
interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  register?: UseFormRegister<FieldValues>
  name: string
  underline?: boolean
  label?: string
}

const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ error, register, name, underline, label, ...rest }, ref) => {
    return (
      <div className={style.wrapper}>
        <label className={style.label} htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          className={`${style.input} ${underline ? style.underline : ''}`}
          {...(register && register(name))}
          {...rest}
        />

        {error && <p className={style.error}>{error}</p>}
      </div>
    )
  }
)

export default Input
