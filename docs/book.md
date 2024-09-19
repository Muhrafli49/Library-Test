# Book Api Spec

## Get all stock books unless out of stock

Endpoint : GET /library/books/available

Response Body Success :

```json
{
  "status": "success",
  "message": "Data buku berhasil didapatkan",
  "data": [
    {
      "_id": "1",
      "code": "Code",
      "title": "Title",
      "author": "Author",
      "stock": 1
    },
    {
      "_id": "2",
      "code": "Code 2",
      "title": "Title 2",
      "author": "Author 2",
      "stock": 1
    }
  ]
}
```
