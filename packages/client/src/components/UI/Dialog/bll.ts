import { useCallback, useState } from 'react'

interface UseDialogType {
  (): {
    isActive: boolean
    onOpen: () => void
    onClose: () => void
  }
}

/** Хук для работы с модалкой */
export const useDialog: UseDialogType = () => {
  const [open, setOpen] = useState(false)

  /** Открытие модалки */
  const onOpen = useCallback(() => {
    setOpen(true)
  }, [])

  /** Закрытие модалки */
  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  return {
    isActive: open,
    onOpen,
    onClose,
  }
}
