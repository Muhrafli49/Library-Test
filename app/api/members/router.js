const express = require('express');
const router = express();
const { handleBorrowBook, handleReturnBook, handleGetMembers } = require('./controller');


router.post('/borrow', handleBorrowBook);

router.post('/return', handleReturnBook);

router.get('/all', handleGetMembers);

module.exports = router;