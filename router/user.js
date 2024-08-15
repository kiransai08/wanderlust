const express = require("express");
const router= express.Router();
const user= require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport");
const LocalStratergy = require("passport-local");
const {isLoggedIn} = require("../midddleware.js");

router.get("/signup" , (req,res)=>{
    res.render("users/signup.ejs");

})

router.post("/signup",wrapAsync(async(req,res)=>{

    try{
    let {username,email,password} = req.body;

   const newUser =  new user({email,username});
  const registereduser = await user.register(newUser , password);
  console.log(registereduser);

  req.flash("success" , "user registered");
  res.redirect("/listings");
    }

    catch(e){
        req.flash("error" , "user present");
        res.redirect("/signup");

    }

}))

router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login" ,passport.authenticate("local" ,{failureRedirect : "/login" , failureFlash : true} ) , async(req,res)=>{
    res.send("welcome to bnb")

})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have logged out successfully");
        res.redirect("/listings");
    });
});

module.exports = router;