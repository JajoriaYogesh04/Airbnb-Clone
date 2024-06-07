const User= require("../models/user.js");
const wrapAsync= require("../utils/wrapAsync.js");

module.exports.renderSignupForm= (req, res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup= wrapAsync(async (req, res)=>{
    try{
        let {username, email, password}= req.body;
        let newUser= new User({
            username: username,
            email: email,
        });
        let registeredUser= await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", `Sign Up Successfully: Welcome to WanderLust ${username}`);
            res.redirect("/listing");
        })
        // console.log(registeredUser);
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})

module.exports.renderLoginForm= (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.login= async(req, res)=>{
    req.flash("success", "Welcome Back to WanderLust");
    // res.redirect("/listing");
    // res.redirect(req.session.redirectUrl);
    let redirectUrl= res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout= (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You Logged Out!")
        res.redirect("/listing");
    });
}