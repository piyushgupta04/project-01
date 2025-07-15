const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');

const Schema = mogoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: "https://ik.imagekit.io/myImages/template_1080%20x%201080.mp4?updatedAt=1752295406700",
        set: (v) => v === "" ? "https://ik.imagekit.io/myImages/template_1080%20x%201080.mp4?updatedAt=1752295406700" : v,
    },
    price: {
        type: Number,
        required: true,
    },
    location:  {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing;