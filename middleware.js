const Listing= require("./models/listing.js");


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

module.exports.isOwner= async (req, res, next)=>{
    let { id }= req.params;
    let listing= await Listing.findById(id);
    if(!res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error", "Authorization Error: You are not the owner of this listings");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

