const express = require('express')

// ! mergeParams se ID access kar sakte ho req.params se!
const router = express.Router({mergeParams: true});


// Mongoose Model
const Review = require('../models/review.js')
const Listing = require('../models/listing.js')

// * Wrapper function for .catch() 
const wrapAsync = require('../utils/wrapAsync.js')

// * Joi's Validation schema
const {joi_reviewSchema} = require('../schema.js')

// * Joi's validation function
const validateReview = (req, res, next) => {
  let {error} = joi_reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg)
  }
  next()
}

// ! new review
router.post('/', validateReview, wrapAsync( async (req, res)=>{
  console.log("review route working!")
  let {id} = req.params
  let get_listing = await Listing.findById(req.params.id)
  let new_review = new Review(req.body.review)
  await new_review.save()
  get_listing.reviews.push(new_review);
  await get_listing.save()
  req.flash('success_msg', 'Review added successfully!')
  res.redirect(`/listings/${id}`)
}))


// ! delete review
router.delete('/:reviewID', wrapAsync ( async (req, res)=>{
  const {id, reviewID} = req.params;
  const r = await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewID}})
  await Review.findByIdAndDelete(reviewID)
  console.log(r)
  req.flash('success_msg', 'Review deleted successfully!')
  res.redirect(`/listings/${id}`)
}))

module.exports = router