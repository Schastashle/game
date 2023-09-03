import { useLayoutEffect } from 'react'
import useLocalStorage from './useLocalStorage'

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light')

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setTheme(theme)
  }, [theme])

  return { theme, setTheme }
}
