# filebump 

simple filestore http server

Upload, download files to server and load files from server

### upload

вы можете отправить файл на filebump и получить ссылку для скачивания файла


### download 

вы можете оправить ссылку на файл, вы получите ссылку для скачивания, filebump скачает файл и будет отдавать этот файл по ссылке


## примеры использования

### upload

`````
curl \
  -F "file=@test.png" \
  -H "X-API-Key: test" \
  https://server.com/upload
`````

### download

`````
curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"url":"https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg"}' \
  -H "X-API-Key: test" \
  https://server.com/download

`````

### npm filebump-client

в приложениях nodejs используйте filebump-client

> npm install filebump-client

примеры использования в client-samples


## скачивание файла

методы загрузки файла возвращают json, который содержит fileId и url для его скачивания

`````
{
    fileId: 'XFqDEPFA90BqPOCoWe8iGGtkWGVKRlRAEwyg',
    url: 'https://server.com/file/XFqDEPFA90BqPOCoWe8iGGtkWGVKRlRAEwyg'
}
`````

#### filename

некоторым сервисам требуется чтобы ссылка на файл содержала расширение файла

вы можете добавить filename в ссылке, чтобы она была понятна такому сервису

например: https://server.com/file/XFqDEPFA90BqPOCoWe8iGGtkWGVKRlRAEwyg/avatar.jpg


## конфигурирование

необходимо указать 

- baseUrl - адреc filebump

- uploadDir - директория для хранения файлов

- keys - массив ключей для загрузки (чтобы только свои могли загружать файлы)


## docker

в репо лежит Dockerfile для сборки image и docker-compose.yml как пример использования filebump


## Ссылки

- [filebump — хостинг файлов по API](https://habr.com/ru/post/716450/)
