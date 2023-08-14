const CACHE_NAME = 'my-site-cache-v1'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        const files = self.__WB_MANIFEST.map(item => item.url)
        return cache.addAll(files)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('fetch', function (event) {
  // фикс конфликтов с экстеншенами хрома
  if (!event.request.url.startsWith('http')) {
    return
  }
  event.respondWith(
    caches
      .match(event.request) // Ищем в кэше соответствующий запросу ресурс
      .then(function (response) {
        if (response) {
          return response // Возвращаем кэшированный ресурс, если он найден
        }

        // Если ресурса нет в кэше, делаем фактический запрос
        return fetch(event.request).then(function (response) {
          // Клонируем ответ, так как response может быть использован только один раз
          const responseClone = response.clone()

          caches
            .open(CACHE_NAME) // Открываем кэш
            .then(function (cache) {
              // Кэшируем новый ресурс для будущих запросов
              cache.put(event.request, responseClone)
            })

          return response // Возвращаем ответ
        })
      })
  )
})
