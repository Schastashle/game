import ForumLayout from '../components/ForumLayout/ForumLayout'
import { mockData } from './mockData'

export default function Forum() {
  return (
    <ForumLayout topics={mockData}>
      <h2>Выберите тему</h2>
    </ForumLayout>
  )
}
