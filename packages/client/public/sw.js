const CACHE_NAME = 'my-site-cache-v1'

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Находим все файлы с расширением ".js" и кэшируем их
        return fetch('/dist/')
          .then(function(response) {
            return response.text();
          })
          .then(text => {
            const jsFiles = text.match(/<script.*?src="(.*?\/index\..*?\.js.*?)"/gi)
            const formattedJSFiles = jsFiles.map(url => `/dist/assets/${url.match(/src="(.*?)"/i)[1].split('/').pop()}`)

            if (formattedJSFiles) {
              return cache.addAll([...formattedJSFiles, '/dist/index.html']);
            }
          });
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
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