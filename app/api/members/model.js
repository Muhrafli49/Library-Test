const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const MemberSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    borrowedBooks: [{
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Books' 
        },
        borrowDate: {
            type: Date,
            default: Date.now
        }
    }],
    penalty: {
        type: Boolean,
        default: false
    },
    penaltyEndDate: {
        type: Date
    }
});

module.exports = model('Members', MemberSchema);
