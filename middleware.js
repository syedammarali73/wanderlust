module.exports.isLoggedIn = (req, res, next) => {
    console.log(`req.user: ${req.user}`);
    if(!req.isAuthenticated()){
        req.flash("error", "you must be logged in to create listing!")
        return res.redirect("/login")
    }
    next()
}