import ForumTopic from '../ForumTopic'
import ForumLayout from '../components/ForumLayout/ForumLayout'
import { useParams } from 'react-router-dom'

export default function Forum() {
  const { id } = useParams()
  const intId = id ? Number.parseInt(id) : NaN

  return (
    <ForumLayout id={intId}>
      {isNaN(intId) && <h2>Выберите тему</h2>}
      {!isNaN(intId) && <ForumTopic id={intId} />}
    </ForumLayout>
  )
}
