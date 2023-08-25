export default (string: string): string => {
  return string.replace(/[^a-zа-яё0-9\s]/gi, '')
}
