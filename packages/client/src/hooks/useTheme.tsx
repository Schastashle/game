import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setTheme(theme)
  }, [theme])

  return { theme, setTheme }
}
