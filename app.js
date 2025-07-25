const express = require ('express');
const app = express();


const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config()
 

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;


const Listing = require('./models/listing')
const Log = require('./models/log.js')
const wrapAsync = require('./utils/wrapAsync.js')
const {joi_listingSchema, joi_reviewSchema} = require('./schema.js')
const Review = require('./models/review.js')

const ExpressError = require('./utils/ExpressError.js')

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate)
 
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))


main().then((r)=>{ 
  console.log(`App connected with database!`)
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URL + DB_NAME);
}


app.listen(PORT, ()=>{
    console.log("Server is up");
})

// Fetch all listings from DB
app.get('/listings', wrapAsync( async (req, res)=>{
  let allData = await Listing.find({})
  // console.log('Fetching completed ... ✅')
  res.render('listings/index.ejs', {allData})
}))

// ! validator
const validateListing = (req, res, next) => {
  console.log(req.body)  
  let {error} = joi_listingSchema.validate(req.body)
  const msg = error.details.map(el => el.message).join(',');
  if(error){
    throw new ExpressError(400, msg)
  }
  next()
}

const validateReview = (req, res, next) => {
  let {error} = joi_reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(400, msg)
  }
  next()
}

// Fetch a specific listings from DB
app.get('/listings/new', (req, res)=>{
  res.render('listings/new.ejs')
})

// Adds a new listings in the DB
app.post('/listings', validateListing ,wrapAsync( async (req, res)=>{
  console.log(req.body)
  const r = new Listing(req.body.obj)
  await r.save();
  // console.log('Data saved successfuly!');
  res.redirect("/listings");
}))


// Loads edit page for pre existing listings
app.get('/listings/:id/edit', wrapAsync( async (req, res)=>{
    const {id} = req.params
    const detail = await Listing.findById(id)
    if (!detail) {
      return res.send("Listing not found");
    }
    res.render('listings/edit.ejs', {detail})
    // console.log(detail);
}))

// Finds a listing on the basis of _id and deletes it from the DB
app.delete('/listings/:id',wrapAsync( async (req, res)=>{
  const {id} = req.params
  const r = await Listing.findByIdAndDelete(id)
  // console.log(r)
  res.redirect('/listings')
}))

// edits pre existing post
app.put('/listings/:id', validateListing, wrapAsync( async(req, res)=>{
  const {id} = req.params;
  const r = await Listing.findByIdAndUpdate(id, { ...req.body.obj})
  res.redirect(`/listings/${id}`)
}))

// open's up full detail page for the specific listings
app.get('/listings/:id', wrapAsync( async (req, res)=>{
   const { id } = req.params;
   const detail = await Listing.findById(id).populate("reviews")
  //  console.log('Got it!, now sending ...')
   res.render('listings/details.ejs', {detail})

}))

//review route
app.post('/listings/:id/reviews', validateReview, wrapAsync( async (req, res)=>{
  console.log("review route working!")
  let {id} = req.params
  let get_listing = await Listing.findById(req.params.id)
  let new_review = new Review(req.body.review)
  await new_review.save()
  get_listing.reviews.push(new_review);
  await get_listing.save()
  console.log("working")
  // res.send("review saved, check your DB")
  res.redirect(`/listings/${id}`)
}))

// root route!
app.get('/', (req, res) =>{
    res.redirect('/listings')
})




// Default handler to get logs of the encountered err
// Using try catch block for async errors!
// app.use( async (err, req, res, next)=>{
//   try{
//     let message = err.message
//     let log = await new Log({
//       name: message,
//     })
//     await log.save()
//     console.log("Log saved successfuly ✅")
//     next(err)
//   } catch(err){
//     console.log("Catch triggered!")
//     next(err)
//   }
// })


// Default error handler
app.use((err, req, res, next) => {
  let { statusCode=500, message="Something went wrong!"} = err;
  console.log(statusCode, message)
  res.status(statusCode).render('error.ejs', { err });
});

 