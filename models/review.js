const { string, number } = require('joi');
const mongoose = require('mongoose');
const { type } = require('../schema');
const Schema = mongoose.Schema;

let ReviewSchema = Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review;