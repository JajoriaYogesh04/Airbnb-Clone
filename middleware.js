const isLoggedIn= (req, res, next)=>{
    // console.log(req.user)
    if(!req.isAuthenticated()){
        req.flash("error", "Please Login to continue...");
        return res.redirect("/login");
    }
    next(); 
}

module.exports= { isLoggedIn };