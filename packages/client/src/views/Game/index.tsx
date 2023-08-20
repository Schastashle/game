import { FC, useEffect, useState } from 'react'
import { default as GameEngine } from './Game'

const Game: FC = () => {
  const [clientSide, setClientSide] = useState(false)
  useEffect(() => {
    setClientSide(true)
  }, [])

  return clientSide ? <GameEngine /> : null
}

export default Game
