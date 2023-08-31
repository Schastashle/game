const CACHE_NAME_BASE = 'cache-v'
const pathItems = self.__WB_MANIFEST

const version = calcVersion(pathItems)
const CACHE_NAME = `${CACHE_NAME_BASE}-${version}`

self.addEventListener('install', function (event) {
  let files = pathItems.map(item => item.url)

  files = files.filter(path => 'index.html' !== path)

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(files)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

const IGNORE_METHODS = new Set(['put', 'post'])

function useDefaultFetch(event) {
  const { url } = event.request

  if (
    IGNORE_METHODS.has(event.request.method.toLocaleLowerCase()) ||
    !url.startsWith('http')
  ) {
    return true
  }

  return false
}

function isOkResponse(response) {
  // response.type = basic: Normal, same origin response, with all headers exposed except "Set-Cookie".

  return (
    response &&
    response.status >= 200 &&
    response.status < 300 &&
    response.type === 'basic'
  )
}

self.addEventListener('fetch', function (event) {
  // фикс конфликтов с экстеншенами хрома
  if (useDefaultFetch(event)) {
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
          // Если что-то пошло не так, выдаём в основной поток результат, но не кладём его в кеш
          if (!isOkResponse(response)) {
            return response
          }

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

function calcVersion(pathItems) {
  const str = pathItems
    .map(item => `${item.url}::${item.revision || ''}`)
    .join('::')
  return pathItems.length > 0
    ? String(hashCode(str))
    : String(new Date().getTime())
}

function hashCode(str) {
  let hash = 0
  for (let i = 0, len = str.length; i < len; i += 1) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr // eslint-disable-line no-bitwise
    hash |= 0 // eslint-disable-line no-bitwise
    // Convert to 32bit integer
  }
  return hash
}
