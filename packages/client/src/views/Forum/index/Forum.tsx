import ForumTopic from '../ForumTopic'
import ForumLayout from '../components/ForumLayout/ForumLayout'
import { mockData } from './mockData'
import { useParams } from 'react-router-dom'

export default function Forum() {
  console.info('*** Forum')

  const { id } = useParams()
  const intId = id ? Number.parseInt(id) : NaN

  return (
    <ForumLayout topics={mockData} id={intId}>
      {isNaN(intId) && <h2>Выберите тему</h2>}
      {!isNaN(intId) && <ForumTopic id={intId} />}
    </ForumLayout>
  )
}
