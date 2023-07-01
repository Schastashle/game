import { FC, memo, useEffect } from 'react'
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

  return (
    <div
      className={style.block}
      data-active={open ? true : undefined}
      onClick={e => {
        if (onClose) {
          onClose()
        }
      }}>
      <div
        onClick={e => {
          e.stopPropagation()
        }}
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
