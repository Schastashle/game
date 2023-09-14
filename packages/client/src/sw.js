const BASE_CACHE_NAME = "fiar--";
const IGNORE_METHODS = new Set(['put', 'post'])

let key = `__VITE_BUILD_DATE__`
if (key.indexOf("__") >= 0) console.error("В dev режиме необходимо чистить кеш вручную")

let indexCache = 0
let CACHE_NAME = incCacheName()
console.info(CACHE_NAME);

function incCacheName() {
  indexCache += 1;
  CACHE_NAME = `${BASE_CACHE_NAME}[${key}]-${indexCache}`
}

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(deteleOld())
})

self.addEventListener('fetch', function (event) {
  
  deteleOldWithCheck(event) // разобраться с куками, они как будто сохряняются в кеш

  // фикс конфликтов с экстеншенами хрома
  if (useDefaultFetch(event)) {
    return
  }

  event.respondWith(fetchWithCheck(event))
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING')
    self.skipWaiting()
})


function deteleOldWithCheck(event) {
  const { url } = event.request
  const urlObj = new URL(url)

  if (urlObj.pathname.indexOf('oauth/yandex') || urlObj.pathname.indexOf('auth/logout')) {
    incCacheName()
    deteleOld()
  }
}

function useDefaultFetch(event) {
  const { url } = event.request
  const urlObj = new URL(url)

  if (
    IGNORE_METHODS.has(event.request.method.toLocaleLowerCase()) ||
    urlObj.pathname.startsWith('/api') || urlObj.pathname.startsWith('/forum/v1')
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

async function fetchWithCheck (event) {
  // в оффлайн режиме можно попробовать искать 
  // любую ранее загруженную страницу, если нужной нет
  if (navigator?.onLine) {
    // спросим на бэке
    const serverResponse = await fromNetwork(event.request, true)
    if (serverResponse) return serverResponse
  }
  
  // если не получили от бэка, поищем в кеше
  const cachedResponse = fromCache(event.request) 
  if (cachedResponse) return cachedResponse

  // а вот тут надо еще что-то вернуть, пример  new Response(FALLBACK, { headers: {'Content-Type': 'image/svg+xml'}}));
}

async function fromCache(request) {
  const response = await getCacheItem(request.clone())
  if (response) return response.clone()
}

// тут скорее всего еще таймаут нужен
async function fromNetwork(request, withSave) {
  const oldCacheName = CACHE_NAME;
  const clonedRequest = request.clone();
  let response;
  try {
    response = await fetch(clonedRequest)
  }
  catch (exp) {
    console.info(request.url, exp)
    throw exp
  } 

  if (!isOkResponse(response)) {
    return response
  } 
  
  if (withSave) {
    if (oldCacheName === CACHE_NAME) {
      await setCacheItem(clonedRequest, response.clone())
    }
  }

  return response
}

// получает объект из кеша
async function getCacheItem(key) { // key : RequestInfo | URL
  const cache = await getCache()
  return await cache.match(key) // с первым совпадающим запросом в объекте Cache https://developer.mozilla.org/en-US/docs/Web/API/Cache/match
}

// добавляет объект в кеш
async function setCacheItem(key, value) { // key: RequestInfo | URL, value: Response
  const cache = await getCache()
  return await cache.put(key, value)
}

// вернуть кеш по имени указанном в CACHE_NAME
async function getCache() {
  return await caches.open(CACHE_NAME)
}

async function deteleOld() {
  const cacheNames = await caches.keys()

  return Promise.all(
    cacheNames
      .filter(
        name => name !== CACHE_NAME && name.startsWith(BASE_CACHE_NAME)
      )
      .map(name => {
        return caches.delete(name)
      })
  )
}


