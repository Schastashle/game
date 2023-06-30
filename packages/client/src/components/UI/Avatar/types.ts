export interface AvatarType {
  /** src картинки */
  src: string

  /** ширина аватара */
  size?: keyof typeof EAvatarSize
}

export enum EAvatarSize {
  small = '36px',
  medium = '48px',
  large = '62px',
}
