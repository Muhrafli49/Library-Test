const express = require('express');
const router = express();
const { index } = require('./controller')

router.get('/available', index);

module.exports = router;