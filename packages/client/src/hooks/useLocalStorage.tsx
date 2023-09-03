import { useState, useEffect } from 'react'

export const useLocalStorage = (key: string, initialValue: unknown) => {
  const [clientSide, setClientSide] = useState(false)

  useEffect(() => {
    setClientSide(true)
  }, [])

  const [value, setValue] = useState(() => {
    if (clientSide) {
      const storedValue = localStorage.getItem(key)
      return storedValue ? JSON.parse(storedValue) : initialValue
    }
    return initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
