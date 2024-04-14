const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require('mongoose');
// const DB_NAME = "wanderlust";
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session")
const dotenv = require("dotenv");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");


dotenv.config({
    path: './.env'
});

main()
.then(res => console.log("Connect to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

//   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


const sessionOptions = {
    secret: "mysuersecretstring", 
    //TODO: have to add secure string
	resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get("/", (req, res)=>{
    res.send("Hi, I am root")
})

app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

app.get("/demouser", async (req, res)=> {
    let fakeUser = new User({
        email : "student@gmail.com",
        username: "delta-student"
    });
    //                      password
    let registeredUser = await User.register(fakeUser, "helloworld")
    res.send(registeredUser)
})

app.use("/listings", listings);
app.use('/listings/:id/reviews', reviews)

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next)=>{
    let {statusCode = 500, message= "something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err})
    // res.status(statusCode).send(message);
})

app.listen(port, ()=>{
    console.log(`server is listening to port: ${port}`);
})