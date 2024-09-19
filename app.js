const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const api = '/library';

const membersRouter = require('./app/api/members/router');
const booksRouter = require('./app/api/books/router');

const errorHandler = require('./app/middleware/errorHandler');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Library API'
    });
});

// Use API member
app.use(`${api}/member`, membersRouter);

// Use API book
app.use(`${api}/books`, booksRouter);

app.use(errorHandler);

module.exports = app;
