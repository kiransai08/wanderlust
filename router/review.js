const express= require("express");
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




const reviewvalidation = (req,res,next)=>{
    console.log("review validation started");
    console.log(req.body);
    
    
    let {error} = reviewSchema.validate(req.body);
    // console.log(result);

    if(error)
    {
        console.log(400 , "please enter properly")
    }

    else{
        console.log("going next");
        next()
    }

} 

//root 


router.post("/listings/:id/review" , reviewvalidation , wrapAsync(async(req,res)=>{
    console.log("entered in review posting")
    console.log(req.body);
    
    let{id} = req.params;
    let list = await listing.findById(id).populate("reviews");
    console.log(list)
    
    let r = new review(req.body.review);
    await r.save();
    list.reviews.push(r);

    await list.save();
    console.log("review saved");
    // res.send("saved")
    res.redirect(`/listings/${id}`);
}))



router.delete("/listings/<%= listings.id %>/review/<%= reviews.id %>?_method=DELETE" , async(req,res)=>{
    let {id,reviewid} = req.params;
    let revie = await review.findByIdAndDelete(reviewid);
    revie.save();
    let list = await listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
    res.redirect("/listings/:id");
})


module.exports = router;
