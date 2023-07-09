import { FC, memo, useCallback, useEffect } from 'react'
import style from './dialog.module.css'
import { DialogType, EDialogSize } from './types'

/** Модальное окно */
const Dialog: FC<DialogType> = props => {
  const { children, open, size = 'middle', onClose } = props

  // блокируем фоновый скролл при открытии поп-апа
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [open])

  // остановка всплытия события при клике на модалку, чтоб не вызвать onClose
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation()
  }, [])

  // обработчик закрытия модалки
  const handleCloseDialog = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  return (
    <div
      className={style.block}
      data-active={open ? true : undefined}
      onClick={handleCloseDialog}>
      <div
        onClick={stopPropagation}
        className={style.modal}
        style={{
          width: EDialogSize[size],
        }}>
        {children}
      </div>
    </div>
  )
}

export default memo(Dialog)
