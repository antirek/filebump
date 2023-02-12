# filebump 

simple filestore http server

Upload, download files to server and load files from server

### upload

вы можете отправить файл на filebumo и получить ссылку для скачивания файлв


### download 

вы можете оправить ссылку на файл, вы получите ссылку для скачивания, filebump скачает файл и будет отдавать этот файл по ссылке


## примеры использования

### upload

`````
curl \
  -F "file=@test.png" \
  -H "X-API-Key: test" \
  http://localhost:3000/upload
`````

### download

`````
curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"url":"https://file-examples-com.github.io/uploads/2017/10/file_example_JPG_100kB.jpg"}' \
  -H "X-API-Key: test" \
  http://localhost:3007/download

`````

## скачивание файла

методы загрузки файла возвращают json, который содержит fileId и url для его скачивания

`````
{
    fileId: 'XFqDEPFA90BqPOCoWe8iGGtkWGVKRlRAEwyg',
    url: 'https://server.com/file/XFqDEPFA90BqPOCoWe8iGGtkWGVKRlRAEwyg'
}
`````

## конфигурирования

необходимо указать 

- baseUrl - адреc filebump

- uploadDir - директория для хранения файлов

- keys - массив ключей для загрузки (чтобы только свои могли загружать файлы)

