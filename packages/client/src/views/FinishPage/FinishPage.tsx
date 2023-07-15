import styles from './finish.module.css'

const FinishPage = () => {
  return (
    <section className={styles.finish}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <svg
            className="spinner"
            width="109"
            height="108"
            viewBox="0 0 109 108"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="24.115" cy="24.115" r="24.115" fill="#700961" />
            <rect
              x="12.5398"
              y="12.5391"
              width="23.6327"
              height="23.6327"
              rx="11.8164"
              fill="#E5E6E0"
            />
            <rect
              x="57.8762"
              width="48.2301"
              height="48.2301"
              rx="6"
              fill="#7EC36E"
            />
            <rect
              x="0.482422"
              y="58.8398"
              width="48.2301"
              height="48.2301"
              rx="24.115"
              fill="#E61C5D"
            />
            <rect
              x="60.77"
              y="58.8398"
              width="48.2301"
              height="48.2301"
              rx="24.115"
              fill="#7DACE4"
            />
            <rect
              x="93.8053"
              y="69.9434"
              width="5.78761"
              height="31.3495"
              rx="2.8938"
              transform="rotate(45 93.8053 69.9434)"
              fill="#E5E6E0"
            />
            <rect
              x="71.8628"
              y="74.0264"
              width="5.78761"
              height="31.3495"
              rx="2.8938"
              transform="rotate(-45 71.8628 74.0264)"
              fill="#E5E6E0"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Поздравляем!</h1>
        <p className={styles.text}>Ваш счет:</p>
        <p className={styles.count}>5 000</p>
        <button className={styles.start}>
          <svg
            width="56"
            height="65"
            viewBox="0 0 56 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M56 32.5L0.499997 64.9759L0.5 0.0240454L56 32.5Z"
              fill="white"
            />
          </svg>
        </button>
        <button className={styles.exit}>
          <svg
            width="45"
            height="45"
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M36.16 22.5H21.1362"
              stroke="white"
              stroke-width="2.33"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M30.9565 29.3181L37.4999 22.4998L30.9565 15.6816"
              stroke="white"
              stroke-width="2.33"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M25.2272 13.125V7.5H7.5V37.5H25.2272V31.875"
              stroke="white"
              stroke-width="3.33"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  )
}

export default FinishPage
