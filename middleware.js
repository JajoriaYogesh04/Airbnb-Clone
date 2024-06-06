const isLoggedIn= (req, res, next)=>{
    // console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;        // Save redirect URL
        req.flash("error", "Please Login to continue...");
        return res.redirect("/login");
    }
    next(); 
}
module.exports= { isLoggedIn };

module.exports.saveRedirectUrl= (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

// module.exports= { saveRedirectUrl };

