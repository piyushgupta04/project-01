const mongoose = require('mongoose');
const listing = require('../models/listing.js')
const initData = require('./data.js')
require('dotenv').config({ path: '../.env' });

const DB_URL = process.env.DB_URL;
const DB_NAME = process.env.DB_NAME;

const path = require('path')

console.lob(DB_NAME)

main().then((r)=>{
    console.log(`load.js connected successfuly with DB`)
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(DB_URL+DB_NAME);
}

async function loadData(){
    console.log("Trying to flush existing data from the Database ...")
    await listing.deleteMany({})
    await listing.insertMany(initData.data)
}

loadData().then((r)=>{
    console.log("Initial data inserted successfuly in the Database!")
}).catch((e)=>{
    console.log("Something went wrong!, Error:", e)
})