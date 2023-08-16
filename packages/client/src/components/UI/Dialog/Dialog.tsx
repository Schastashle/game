import { FC, memo, useCallback, useEffect, MouseEvent } from 'react'
import style from './dialog.module.css'
import { DialogType, EDialogSize } from './types'

/** Модальное окно */
const Dialog: FC<DialogType> = props => {
  console.info('dialog render')
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
  const stopPropagation = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  // обработчик закрытия модалки
  const handleCloseDialog = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])
  /*
  style={{
          width: EDialogSize[size],
        }}

        {children}
  */

  return (
    <div
      className={style.block}
      data-active={open ? true : undefined}
      onClick={handleCloseDialog}>
      <div onClick={stopPropagation} className={style.modal}>
        {children}
      </div>
    </div>
  )
}

export default memo(Dialog)
