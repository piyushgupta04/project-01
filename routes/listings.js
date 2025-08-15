const express = require('express')
const router = express.Router();

// * Mongoose Model 
const Listing = require('../models/listing')

// * wrapAsync fn()
const wrapAsync = require('../utils/wrapAsync.js')

// * isAuthenticated fn()
// In listings.js
const {isLoggedIn, isOwner_listing, validateListing} = require('../middlewares.js') 



// ! Create listing page
router.get('/new', isLoggedIn, (req, res)=>{
  res.render('listings/new.ejs')
})

// ! Open's up full detail page for the specific listings
router.get('/:id', wrapAsync( async (req, res)=>{
  const { id } = req.params;
  const detail = await Listing.findById(id).populate("reviews").populate('owner')
  console.log(detail)
  if(!detail){
    req.flash('error_msg', 'The listing your are requested does not exists!')
    return res.redirect('/listings')
 }
//  console.log('Got it!, now sending ...')
 res.render('listings/details.ejs', {detail})
}))


// ! Fetch all listings from DB
router.get('/', wrapAsync( async (req, res)=>{
  let allData = await Listing.find({})
  res.render('listings/index.ejs', {allData})
}))




// ! Adds a new listings in the DB
router.post('/', isLoggedIn, validateListing ,wrapAsync( async (req, res)=>{
  console.log(req.body)
  const r = new Listing(req.body.obj)
  // this line will fetch current user's detail from user object, because passport saves the current user's details in 'user' object once the user is successfuly logged in!
  r.owner = req.user._id
  await r.save();
  req.flash('success_msg', 'Listing added successfully!')
  res.redirect("/listings");
}))


// ! Loads edit page for pre existing listings
router.get('/:id/edit', isLoggedIn,isOwner_listing, wrapAsync( async (req, res)=>{
    const {id} = req.params
    const detail = await Listing.findById(id)
    if (!detail) {
      req.flash('error_msg', 'The listing your are requested does not exists!')
      return res.redirect('/listings')
    }
    res.render('listings/edit.ejs', {detail})
}))


// ! Finds a listing on the basis of _id and deletes it from the DB
router.delete('/:id', isLoggedIn, isOwner_listing, wrapAsync( async (req, res)=>{
  const {id} = req.params
  const r = await Listing.findByIdAndDelete(id)
    req.flash('success_msg', 'Listing deleted successfully!')
    res.redirect('/listings')
  }))
  
  
  // ! Edits pre existing post
  router.put('/:id', isLoggedIn, isOwner_listing, validateListing, wrapAsync( async(req, res)=>{
    const {id} = req.params;
    // * here, we will add another layer of authentication which will checks if the user ownes this listing or not!! (we already implemented the first part of this by hiding the EDIT and DELETE button from the Property listing page but this will ensures it as well!)
    // objID1.equals(objID2) => ye basically check karta haa ki obj1 ki ID obj2 ki ID ke equal yani same ha ki nahi!
    // agar listing ka owner ki ID is not equals to current user ki ID to vo listing update nahi kar sakta kyunki ye uski lising nahi ha
    // kyunki agar uski listing hoti to uss listing ka owner me uske object ka reference store hota!
    // const listing = await Listing.findById(id)
    // if (!listing.owner.equals(res.locals.current_user._id)){
    //   req.flash('error_msg', "The listing you are trying to access does'nt belongs from you!")
    //   return res.redirect(`/listings/${id}`)
    // }
    const r = await Listing.findByIdAndUpdate(id, { ...req.body.obj})
    req.flash('success_msg', 'Listing updated successfully!')
    res.redirect(`/listings/${id}`)
  }))
  
  


// * Simply exported this to require in app.js
module.exports = router