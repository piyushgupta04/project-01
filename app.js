const express = require ('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config()
const ejsMate = require('ejs-mate');
const session = require('express-session')
const flash = require('connect-flash');

// enviroment variables!
const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;

// setting cookies (express-session cconfigs + middleware used!)
const session_config = {
    secret: "HiLrUJyQ5vQQelF3wi6ucgEwrB9AJM09x4D1HAbmWds=",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
  }
}

app.use(session(session_config))
app.use(flash())

app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

// * capturing routes-
const listings = require('./routes/listings.js')
const reviews = require('./routes/reviews.js')

// * Mongoose Models for DB
const Listing = require('./models/listing')
const Review = require('./models/review.js')

// * Wrapper function to add .catch in express function!
// Quite irrevelent in this file now.
const wrapAsync = require('./utils/wrapAsync.js')

// * Joi's schema for server side validation
const {joi_listingSchema, joi_reviewSchema} = require('./schema.js')

// * Importing custom error class from utils
const ExpressError = require('./utils/ExpressError.js');

// MethodOverride for handling special requests
const methodOverride = require('method-override');

// Default Requirements for public and ejs
app.engine('ejs', ejsMate)
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

app.use('/listings', listings )
app.use('/listings/:id/reviews', reviews )

app.listen(PORT, ()=>{
    console.log("Server is up");
})


// ! validation function (irrevelent in app.js FR)
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


// root route!
app.get('/', (req, res) =>{
    res.redirect('/listings')
})

// NEED TO CREATE A LOGGER

// Default error handler
app.use((err, req, res, next) => {
  let { statusCode=500, message="Something went wrong!"} = err;
  console.log(statusCode, message)
  res.status(statusCode).render('error.ejs', { err });
});
