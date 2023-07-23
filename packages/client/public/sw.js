const CACHE_NAME = 'my-site-cache-v1'
const URLS = [
  '/dist/assets/index.0117cb92.js',
  '/dist/index.html'
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache')
        return cache.addAll(URLS)
      })
      .catch(error => {
        console.error(error)
        throw error
      })
  )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request) // Ищем в кэше соответствующий запросу ресурс
      .then(function(response) {
        if (response) {
          return response; // Возвращаем кэшированный ресурс, если он найден
        }

        // Если ресурса нет в кэше, делаем фактический запрос
        return fetch(event.request)
          .then(function(response) {
            // Клонируем ответ, так как response может быть использован только один раз
            const responseClone = response.clone();

            caches.open(CACHE_NAME) // Открываем кэш
              .then(function(cache) {
                // Кэшируем новый ресурс для будущих запросов
                cache.put(event.request, responseClone);
              });

            return response; // Возвращаем ответ
          })
          .catch(function(error) {
            console.error('Ошибка при выполнении запроса:', error);
          });
      })
  );
});