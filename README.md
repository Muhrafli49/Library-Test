# Backend Test Cases for Library Management System

## Use Cases

### Members Can Borrow Books with Conditions
- **Members may not borrow more than 2 books**: Each member is allowed to borrow a maximum of two books at a time.
- **Borrowed books are not borrowed by other members**: A book that is currently borrowed by one member cannot be borrowed by another member until it is returned.
- **Member is currently not being penalized**: A member who is under penalty cannot borrow any books.

### Member Returns the Book with Conditions
- **The returned book is a book that the member has borrowed**: Only books that were previously borrowed by the member can be returned.
- **If the book is returned after more than 7 days, the member will be subject to a penalty**: If a book is returned later than 7 days from the due date, the member will incur a penalty.
- **Member with penalty cannot borrow books for 3 days**: Members who have incurred a penalty will be restricted from borrowing any books for a period of 3 days.

### Check the Book
- **Shows all existing books and quantities**: Displays a list of all books available in the library along with their quantities.
- **Books that are being borrowed are not counted**: Books that are currently borrowed by members are excluded from the available stock count.

### Member Check
- **Shows all existing members**: Displays a list of all members registered in the system.
- **The number of books being borrowed by each member**: Shows how many books each member currently has borrowed.

