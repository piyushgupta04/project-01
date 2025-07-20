const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    image: {
        type: String,
        required: true,
        default: "https://ik.imagekit.io/myImages/template_1080%20x%201080.mp4?updatedAt=1752295406700",
        set: (v) => v === "" ? "https://ik.imagekit.io/myImages/template_1080%20x%201080.mp4?updatedAt=1752295406700" : v,
    },
    price: {
        type: Number,
    },
    location:  {
        type: String,
    },
    country: {
        type: String,
    },
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing;