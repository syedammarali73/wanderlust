const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const router = express.Router();

router.get("/signup", (req, res)=> {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async(req, res)=> {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password)
        console.log("registered User:",registeredUser);
        req.flash("success", "Welcome to Wanderlust")
    
        res.redirect("/listings")
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}))

router.get("/login", async(req, res)=> {
    res.render("users/login.ejs")
})

router.post("/login", passport.authenticate("local",
    {failureRedirect: '/login', 
    failureFlash: true}),
    async(req, res)=> {
    
     req.flash("success","Welcome back to Wanderlust!")
     res.redirect("/listings")
})

router.get("/logout", (req, res)=> {
    req.logOut((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
} )

module.exports = router;