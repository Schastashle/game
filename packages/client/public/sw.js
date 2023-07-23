// service-worker.js
const cacheVersion = 'app-cache-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheVersion)
      .then(function(cache) {
        // Пытаемся найти запрошенный ресурс в кэше
        return cache.match(event.request)
          .then(function(response) {
            // Если ресурс найден в кэше, возвращаем его из кэша
            if (response) {
              return response;
            }

            // Если ресурса нет в кэше, выполняем сетевой запрос
            return fetch(event.request)
              .then(function(response) {
                // Проверяем код HTTP-ответа
                if (response.status === 404) {
                  // Если код ответа 404, возвращаем ошибку или заглушку
                  // return new Response('Resource not found', { status: 404 });
                  // или
                  return response; // Возвращаем оригинальный ответ без кэширования
                }

                // Клонируем полученный ответ, так как он может быть использован только один раз
                const clonedResponse = response.clone();

                // Кэшируем полученный ответ для будущих запросов
                caches.open(cacheVersion)
                  .then(function(cache) {
                    cache.put(event.request, clonedResponse);
                  });

                // Возвращаем оригинальный ответ
                return response;
              })
              .catch(function(error) {
                console.error('Ошибка при выполнении запроса:', error);
                // Возвращаем заглушку или специальный ответ в случае ошибки
                // return new Response('Error occurred. Please try again later.', { status: 500 });
              });
          });
      })
  );
});

