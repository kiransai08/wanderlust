if(process.env.NODE_ENV !=  "production")
{
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate  = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync")
const error = require("./utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("./schema.js");
const { findById } = require("./models/review.js");
const review = require("./models/review.js");
const listingsRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js")
const userRouter = require("./router/user.js");
const MongoStore = require("connect-mongo")


app.set("view engine" , "ejs");
app.set("views", path.join(__dirname , "views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname , "/public")));

const dbUrl = process.env.ATLASDB_URL;

main()
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
    secret: process.env.SECRET,
  }, touchAfter:24*3600
})

store.on("error" , ()=>{
  console.log("error is mongo session storage", err);
})

const sessionOptions = {

    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie: { 
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport LocalStrategy
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash ("success");
    res.locals.error = req.flash ("error");
    res.locals.curruser = req.user;
    next();
})

app.use("/" , listingsRouter);
app.use("/", reviewsRouter);
app.use("/" , userRouter )



app.get("/demouser" , async(req,res)=>{
  const fakeuser = new User({
    email:"helloworld@gmail.com",
    username : "hello08"
  })

  let registereduser = await User.register(fakeuser , "pass1234");

  res.send(registereduser);
})


app.all("*" ,(req,res,next)=>{
    next(new  error(404 ,"page not found"));   
})



app.use((err,req,res,next)=>{
   let{status = 500 , message ="some thing went wrong please check" } = err;

   res.status(status).send(message);
})
app.listen(8080 , (req,res)=>{
    console.log("listening at port no 8080");
    
})