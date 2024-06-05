const isLoggedIn= (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "Please Login to continue...");
        res.redirect("/login");
    }
    next();
}

module.exports= { isLoggedIn };