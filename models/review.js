const { string, number, ref } = require('joi');
const mongoose = require('mongoose');
const { type } = require('../schema');
const Schema = mongoose.Schema;

let reviewSchema = Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // * added author field which stores an objectID of the user who created this comment!
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review;