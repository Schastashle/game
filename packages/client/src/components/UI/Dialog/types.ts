import { ReactNode } from 'react'

export interface DialogType {
  children: ReactNode

  /* открыть или закрыть окно */
  open: boolean

  /* коллбек при закрытия окна */
  onClose?: () => void

  /* размер окна */
  size?: keyof typeof EDialogSize
}

export enum EDialogSize {
  small = '400px',
  middle = '500px',
  large = '600px',
}
