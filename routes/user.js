const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { signUp, renderloginForm, postLogin, logout } = require("../controllers/user");
const router = express.Router();

router.route("/signup")

.get((req, res)=> {
    res.render("users/signup.ejs")
})
.post( wrapAsync(signUp))


router.route("/login")
.get(renderloginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: '/login', 
        failureFlash: true
    }),
    postLogin
)

router.get("/logout", logout)

module.exports = router;