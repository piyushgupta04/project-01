const mongoose = require('mongoose');
const { type } = require('../schema');
const Review = require("./review.js")

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
        default: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60" : v,
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

listingSchema.post('findOneAndDelete', async (data)=>{
    if(data){
        await Review.deleteMany({_id: {$in: data.reviews} })
    }
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing;