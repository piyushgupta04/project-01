const express = require('express')
const router = express.Router();

// * Mongoose Model 
const Listing = require('../models/listing')

// * wrapAsync fn()
const wrapAsync = require('../utils/wrapAsync.js')

// * Joi's validation schema
const {joi_listingSchema} = require('../schema.js')

// * custom class for error handling
const ExpressError = require('../utils/ExpressError.js')

// * Joi's validation fn() 
const validateListing = (req, res, next) => {
  let { error } = joi_listingSchema.validate(req.body);
  if (error) {
    let msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
}


// ! Fetch all listings from DB
router.get('/', wrapAsync( async (req, res)=>{
  let allData = await Listing.find({})
  res.render('listings/index.ejs', {allData})
}))


// ! Fetch a specific listings from DB
router.get('/new', (req, res)=>{
  res.render('listings/new.ejs')
})


// ! Adds a new listings in the DB
router.post('/', validateListing ,wrapAsync( async (req, res)=>{
  console.log(req.body)
  const r = new Listing(req.body.obj)
  await r.save();
  res.redirect("/listings");
}))


// ! Loads edit page for pre existing listings
router.get('/:id/edit', wrapAsync( async (req, res)=>{
    const {id} = req.params
    const detail = await Listing.findById(id)
    if (!detail) {
      return res.send("Listing not found");
    }
    res.render('listings/edit.ejs', {detail})
}))


// ! Finds a listing on the basis of _id and deletes it from the DB
router.delete('/:id',wrapAsync( async (req, res)=>{
  const {id} = req.params
  const r = await Listing.findByIdAndDelete(id)
  res.redirect('/listings')
}))


// ! Edits pre existing post
router.put('/:id', validateListing, wrapAsync( async(req, res)=>{
  const {id} = req.params;
  const r = await Listing.findByIdAndUpdate(id, { ...req.body.obj})
  res.redirect(`/listings/${id}`)
}))


// ! Open's up full detail page for the specific listings
router.get('/:id', wrapAsync( async (req, res)=>{
   const { id } = req.params;
   const detail = await Listing.findById(id).populate("reviews")
  //  console.log('Got it!, now sending ...')
   res.render('listings/details.ejs', {detail})
}))


// * Simply exported this to require in app.js
module.exports = router