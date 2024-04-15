const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { signUp, renderloginForm, postLogin, logout } = require("../controllers/user");
const router = express.Router();

router.get("/signup", (req, res)=> {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(signUp))

router.get("/login", renderloginForm)

router.post(
    "/login", 
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: '/login', 
        failureFlash: true
    }),
    postLogin
)

router.get("/logout", logout)

module.exports = router;