### Как запускать?

1. Убедитесь что у вас установлен `node` и `docker`
2. Выполните команду `yarn bootstrap` - это обязательный шаг, без него ничего работать не будет :)
3. Выполните команду `yarn dev`
3. Выполните команду `yarn dev --scope=client` чтобы запустить только клиент
4. Выполните команду `yarn dev --scope=server` чтобы запустить только server


### Как добавить зависимости?
В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента 
```yarn lerna add {your_dep} --scope client```

Для сервера
```yarn lerna add {your_dep} --scope server```

И для клиента и для сервера
```yarn lerna add {your_dep}```


Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
```yarn lerna add {your_dep} --dev --scope server```


### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

```yarn test```

### Линтинг

```yarn lint```

### Форматирование prettier

```yarn format```

### Production build

```yarn build```

И чтобы посмотреть что получилось


`yarn preview --scope client`
`yarn preview --scope server`

## Хуки
В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Автодеплой статики на vercel
Зарегистрируйте аккаунт на [vercel](https://vercel.com/)
Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
В качестве `root directory` укажите `packages/client`

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот

## Production окружение в докере
Перед первым запуском выполните `node init.js` (чтобы проверить, что сервер работает?)
Для wsl сначала запускаем `sudo service docker start`
Если надо без sudo, читать тут https://docs.docker.com/engine/install/linux-postinstall/

`docker compose up` - запустит три сервиса
1. nginx, раздающий клиентскую статику (client)
2. node, ваш сервер (server)
3. postgres, вашу базу данных (postgres)
`docker compose up --build` создаеть образы перед запуском
`docker compose up --detach` (`-d`) запуск контейнеров в фоновом режиме
`cntr+c` оставить контейнеры


Если вам понадобится только один сервис, просто уточните какой в команде
`docker compose up {sevice_name}`, например `docker compose up server`
Для осатльных команд так же можно указывать сервис

`docker compose build [sevice_name]` пересобрать
`docker compose stop [sevice_name]` остановить
`docker compose start [sevice_name]` запустить
`docker compose down [sevice_name]` удалить

`docker exec -it prakticum-server bash` - например, чтобы посмотреть файловую систему в запущенном контейнере prakticum-server


## ssr
cd packages/client
yarn link
cd ../server
yarn link client

Если надо найти какой процесс держит порт 3001
lsof -i :3001 -t

## Утечки памяти
Память течет, но понять это настоящие утечки или псевдо утечки из-за теневого дом или useCallback, useMemo не удалось
Память чаще течет, но редко бывают ситуации - что память возвращается, чтобы искать настоящие утечки надо убирать
useCallback, useMemo и проверять без них
