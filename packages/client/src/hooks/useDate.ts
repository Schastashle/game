import { useCallback } from 'react'

interface useDateType {
  (): {
    getDate: (date: string) => string
    getTime: (date: string) => string
  }
}

/** хук для работы с датой и временем */
export const useDate: useDateType = () => {
  const getDate = useCallback((dateInit: string) => {
    const date = new Date(dateInit)
    const day = date.getDate()
    const month =
      date.getMonth() + 1 > 10
        ? `${date.getMonth() + 1}`
        : `0${date.getMonth() + 1}`
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }, [])

  const getTime = useCallback((dateInit: string) => {
    const date = new Date(dateInit)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return `${hours}:${minutes}`
  }, [])

  return {
    getDate,
    getTime,
  }
}
