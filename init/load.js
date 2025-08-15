const mongoose = require('mongoose');
const listing = require('../models/listing.js')
const initData = require('./data.js')
require('dotenv').config({ path: '../.env' });

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

const path = require('path')

main().then((r)=>{
    console.log(`load.js connected successfuly with DB`)
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(DB_URL+DB_NAME);
}

async function loadData(){
    console.log("Trying to flush existing data from the Database ...")
    await listing.deleteMany({})
    // this line adds 'owner' in listing's object.
    // map function returns a value so we reassign the returned value in the same variable!
    initData.data = initData.data.map((obj)=>({...obj, owner: '689566a2d54d13bea0ab16b3'}))
    await listing.insertMany(initData.data)
}

loadData().then((r)=>{
    console.log("Initial data inserted successfuly in the Database!")
}).catch((e)=>{
    console.log("Something went wrong!, Error:", e)
})