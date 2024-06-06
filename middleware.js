const Listing= require("./models/listing.js");
const ExpressError= require("./utils/expressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");


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


// const validateListing= (req, res, next)=>{
//     let {error} = listingSchema.validate(req.body);
//     console.log(error);
//     if(error){
//         let errMsg= error.details.map((el)=>{el.message}).join(", ");
//         throw new ExpressError(400, errMsg); 
//     }else{
//         next();
//     }
// }
module.exports.validateListing= (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    // console.log(error);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }   
};


module.exports.validateReview= (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    // console.log(error);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }   
};

