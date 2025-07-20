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
const listingObj = require('./schema.js')

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
  console.log('Fetching completed ... ✅')
  res.render('listings/index.ejs', {allData})
}))

// ! validator
const validateData = (req, res, next) => {
  let result = listingObj.validate(req.body)
  console.log(result)
  if(result.error){
    throw new ExpressError(400, result.error)
  }
}

// Fetch a specific listings from DB
app.get('/listings/new', (req, res)=>{
  res.render('listings/new.ejs')
})

// Adds a new listings in the DB
app.post('/listings', validateData,wrapAsync( async (req, res)=>{
  console.log(req.body)
  const r = new Listing(req.body.obj)
  await r.save();
  console.log('Data saved successfuly!');
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
  console.log(r)
  res.redirect('/listings')
}))

// edits pre existing post
app.put('/listings/:id', validateData, wrapAsync( async(req, res)=>{
  const {id} = req.params;
  const r = await Listing.findByIdAndUpdate(id, { ...req.body.obj}) 
  res.redirect(`/listings/${id}`)
}))

// open's up full detail page for the specific listings
app.get('/listings/:id', wrapAsync( async (req, res)=>{
   const { id } = req.params;
   const detail = await Listing.findById(id)
   console.log('Got it!, now sending ...')
   res.render('listings/details.ejs', {detail})

}))

// root route!
app.get('/', (req, res) =>{
    res.redirect('/listings')
})


// app.use(/.*/, (req, res, next) => {
//   next(new ExpressError(404, "Page not found!"))
// });


// Default handler to get logs of the encountered err
// Using try catch block for async errors!
app.use( async (err, req, res, next)=>{
  try{
    let message = err.message
    let log = await new Log({
      name: message,
    })
    await log.save()
    console.log("Log saved successfuly ✅")
    next(err)
  } catch(err){
    console.log("Catch triggered!")
    next(err)
  }
})


// Default error handler
app.use((err, req, res, next) => {
  let { statusCode=500, message="Something went wrong!"} = err;
  // console.log(err.stack)
  res.status(statusCode).render('error.ejs', { err });
});

