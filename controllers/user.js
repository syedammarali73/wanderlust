const User = require("../models/user");

module.exports.signUp = async(req, res)=> {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password)
        console.log("registered User:",registeredUser);

        req.login(registeredUser, (err)=> {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust")
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderloginForm = async(req, res)=> {
    res.render("users/login.ejs")
}

module.exports.postLogin = async(req, res)=> {

    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout =  (req, res)=> {
    req.logOut((err)=> {
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings")
    })
} 