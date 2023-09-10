import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.error(error)
    },
  })
}
