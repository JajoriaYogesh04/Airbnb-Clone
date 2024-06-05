const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../utils/wrapAsync.js");
const passport= require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// SIGNUP
router.get("/signup", (req, res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res)=>{
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
}))


// LOGIN
router.get("/login", (req, res)=>{
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl, passport.authenticate('local', {failureRedirect: "/login", failureFlash: true}), async(req, res)=>{
    req.flash("success", "Welcome Back to WanderLust");
    // res.redirect("/listing");
    // res.redirect(req.session.redirectUrl);
    let redirectUrl= res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
})



// LOGOUT
router.get("/logout", (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You Logged Out!")
        res.redirect("/listing");
    });
})

module.exports= router;