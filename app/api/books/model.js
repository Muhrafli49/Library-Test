const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const BookSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = model('Books', BookSchema);
