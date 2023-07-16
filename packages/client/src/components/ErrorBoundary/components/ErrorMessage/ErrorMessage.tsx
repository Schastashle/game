import style from './error-message.module.css'

const ErrorMessage = () => {
  return (
    <main className={style.errorMessage}>
      <section className={style.error}>
        <h1>Что-то пошло не так</h1>
        <p>Попробуйте перезагрузить страницу</p>
      </section>
    </main>
  )
}

export default ErrorMessage
