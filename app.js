const express = require ('express');
const app = express();


const path = require('path')
const mongoose = require('mongoose');
require('dotenv').config()
const morgan = require('morgan')
 

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT;


const Listing = require('./models/listing')
const methodOverride = require('method-override');
const { log } = require('console');
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate)
 
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))


main().then((r)=>{ console.log(`App connected with database!`)})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(DB_URL+DB_NAME);
}


app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Server is up at port ${port}`);
})

app.get('/listings', async (req, res)=>{
    try{
      let allData = await Listing.find({})
      console.log('Fetching completed ... ✅')
      res.render('listings/index.ejs', {allData})
    } catch (err) {
      console.log(err);
      res.send({
        message: "Kal ana kal, aaj DB dead ho gaya ha!"
      })
    }
})

app.get('/listings/new', (req, res)=>{
  res.render('listings/new.ejs')
})

app.post('/listings', async (req, res)=>{
  const r = new Listing(req.body.obj)
  try{
    await r.save();
    console.log('Data saved successfuly!');
    res.redirect('/listings');
  }catch(err){
    console.log(err)
  }
})

app.get('/listings/:id/edit', async (req, res)=>{
  const {id} = req.params
  try{
    const detail = await Listing.findById(id)
    if (!detail) {
      return res.send("Listing not found");
    }
    res.render('listings/edit.ejs', {detail})
    console.log(detail);
  }catch(err){
    console.log(err);
  }
})


app.delete('/listings/:id', async (req, res)=>{
  const {id} = req.params
  const r = await Listing.findByIdAndDelete(id)
  console.log(r)
  res.redirect('/listings')
})

app.put('/listings/:id', async (req, res)=>{
  const {id} = req.params;
  const r = await Listing.findByIdAndUpdate(id, { ...req.body.obj}) 
  res.redirect(`/listings/${id}`)
})

app.get('/listings/:id', async (req, res)=>{
  const { id } = req.params;
  try{
     const detail = await Listing.findById(id)
    console.log('Got it!, now sending ...')
    res.render('listings/details.ejs', {detail})
  }catch(err){
    console.log(err)
  }
})


app.get('/', (req, res) =>{
    res.sendStatus(200);
})

