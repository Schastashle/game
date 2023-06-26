import { useRouteError } from 'react-router-dom'

type Error = {
  statusText: string
  message: string
}

export default function Error() {
  const error = useRouteError() as Error

  return (
    <div id="error-page">
      <h2>Oops</h2>
      <i>{error.statusText || error.message}</i>
    </div>
  )
}
