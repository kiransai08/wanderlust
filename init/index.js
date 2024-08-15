const mongoose = require("mongoose");
const listing = require("../models/listing");
const initdata = require("./data.js"); // Corrected the path

main()
  .then(() => {
    console.log("connected to db");
  })
 .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/bnb');
}

async function add() {
  
    listing.insertMany(initdata.data);
    
}

add();
