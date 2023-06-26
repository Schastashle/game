import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

export default function Forum() {
  return (
    <div>
      <div>Forum page</div>
      <Link to="forum/123">Go to topic</Link>
      <Outlet />
    </div>
  )
}
