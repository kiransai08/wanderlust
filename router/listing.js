const express = require("express");

const router = express.Router({mergeParams:true});


const mongoose = require("mongoose");
const listing = require("../models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate  = require("ejs-mate");
const wrapAsync = require("../utils/wrapAsync")
const error = require("../utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("../schema.js");
const { findById } = require("../models/review.js");
const review = require("../models/review.js");
const isLoggedIn = require("../midddleware.js");


const validation = (req,res,next)=>{
    let {error}  = listingSchema.validate(req.body);
    // console.log(result);

    if(error)
    {
        // error(400 , "please enter properly")
        console.log("please enter the correct values")
    }

    else{
        next()
    }
} 


router.get("/" , (req,res)=>{
    res.send("i am root ")
})

//listings route

router.get("/listings" ,  async(req,res)=>{
    // res.send("hell othere")
    // console.log("in the listings route");
    const allListings = await listing.find({});
    // console.log(allListings)
   
    res.render("listings/index" , {allListings});

})

//new Listing

router.get("/listings/new" ,isLoggedIn, (req,res)=>{
  
    res.render("listings/new.ejs")
})

// posting new list
router.post("/listings",  validation ,  wrapAsync(async (req, res,next) => {

       const newdata = new listing(req.body.listing) ;
    
    await newdata.save();
    req.flash("success" , "new listing  created")
    res.redirect("/listings"); 
}))

router.get("/listings/:id/edit" ,isLoggedIn, async (req,res)=>{
    let{id} = req.params;
    const listings = await listing.findById(id)
    // console.log(listings);
    
    res.render("listings/edit.ejs",{listings});
})

//updating the list
router.put("/listings/:id",   async (req, res) => {
    let { id } = req.params;

    let data = req.body.listing
    // let exsistingdata = await listing.findById(id);
    // exsistingdata
    // exsistingdata.image.url = data.image.url;

    let updatedListing = await listing.findByIdAndUpdate(id, {... req.body.listing , image:{filename: "listingimage" , url:req.body.listing.image}});
    console.log(updatedListing);
    console.log(req.body.listing);
    res.redirect("/listings");
});


//show route
router.get("/listings/:id" ,isLoggedIn , async (req,res)=>{
    let{id} = req.params;
    const listings = await listing.findById(id)
    res.render("listings/show",{listings});
})

//delete route

router.delete("/listings/:id" ,isLoggedIn ,  async (req,res)=>{
    let{id} = req.params;
    const del = await listing.findByIdAndDelete(id);
    res.redirect("/listings");

});

module.exports = router;