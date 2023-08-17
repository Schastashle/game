import { FC, memo } from 'react'

const SVGSpinner: FC = () => {
  console.info('SVGSpinner render')
  return (
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
  )
}

export default memo(SVGSpinner)
