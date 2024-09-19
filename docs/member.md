# Member Api Spec

## Create a new book loan

Endpoint : POST /library/member/borrow

Response Body Success :

```json
{
    "status": "success",
    "message": "Buku berhasil dipinjam",
    "data": {
        "_id": "1",
        "code": "Code",
        "name": "Name",
        "borrowedBooks": [
            {
                "book": "BookId",
                "borrowDate": "borrowDate",
                "_id": "BorrowId"
            }
        ],
        "penalty": false,
        "penaltyEndDate": null,
        "__v": 1
    }
}
```

Response Body Error : 

```json
{
    "status": "error",
    "message": "Book is currently unavailable",
    "data": null
}
```


## Create book return

Endpoint : POST /library/member/return

Response Body Success :

```json
{
    "status": "success",
    "message": "Buku berhasil dikembalikan",
    "data": {
        "member": {
            "_id": "BookId",
            "code": "Code",
            "name": "Name",
            "borrowedBooks": [],
            "penalty": false,
            "penaltyEndDate": null,
            "__v": 1
        },
        "returnedBook": {
            "code": "CodeBook",
            "title": "Title"
        }
    }
}
```

Response Body Error : 

```json
{
    "status": "error",
    "message": "Book not borrowed by this member",
    "data": null
}
```

## Get all members with the number of books each member has borrowed.

Endpoint : GET /library/member/all

Response Body Success :

```json
{
    "status": "success",
    "message": "Berhasil mendapatkan daftar anggota",
    "data": [
        {
            "_id": "MemberId",
            "code": "Code",
            "name": "Name",
            "borrowedBooks": [],
            "penalty": false,
            "penaltyEndDate": null
        },
        {
            "_id": "MemberId 2",
            "code": "Code 2",
            "name": "Name 2",
            "borrowedBooks": [],
            "penalty": false,
            "penaltyEndDate": null
        }
    ]
}
```