const express= require("express");
const router= express.Router();
const Listing= require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/expressError.js");
const { listingSchema, reviewSchema} = require("../schema.js");


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
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    // console.log(error);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }   
};

//Index Route
router.get("/", wrapAsync(async (req, res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs", { allListing });
})) 

//New Route
router.get("/new", (req, res)=>{
    console.log("Getting New Request");
    // res.send("Getting New Request");
    res.render("listings/new.ejs");
})

//Show Route
router.get("/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("review");
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listing")
    }
    console.log(`Show request on ID`);
    // res.send(showData);
    // console.log(showData);
    res.render("listings/show.ejs", { listing });
})) 

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next)=>{
    req.flash("success", "New Listing Created!");
    let listing = req.body.listing;
    // console.log(listing);
    // res.send(req.body.listing);
    // console.log(listing);
    // if(!listing){
    //     throw new ExpressError(400, "Send Valid Data For Listing");
    // }
    let newListing= new Listing(listing);
    // if(!newListing.title){
    //     throw new ExpressError(400, "Send Valid Title For Listing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400, "Send Valid Description For Listing");
    // }
    // if(!newListing.price){
    //     throw new ExpressError(400, "Send Valid Price For Listing");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400, "Send Valid Location For Listing");
    // }
    // if(!newListing.country){
    //     throw new ExpressError(400, "Send Valid Country For Listing");
    // }
    await newListing.save()
    res.redirect("/listing");   
})
) 


//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res)=>{
    let { id }= req.params;
    // console.log(`Edit request by: ${id}`);
    let editListing= await Listing.findById(id);
    console.log(editListing);
    // res.send(`Edit request by: ${id}`);
    res.render("listings/edit.ejs", { editListing });
}))

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res)=>{
    req.flash("success", "Listing Updated!");
    let { id }= req.params;
    let editRequest= {...req.body.listing};
    // console.log(id);
    // res.send(editRequest);
    if(!editRequest){
        throw new ExpressError(400, "Send Valid Data For Listing");
    }
    editedListing= await Listing.findByIdAndUpdate(id, editRequest, {new: true, runValidators: true})
    res.redirect(`/listing/${id}`);
})) 

//Destroy Route
router.delete("/:id", wrapAsync(async (req, res)=>{
    req.flash("success", "Listing Deleted!");
    let { id }= req.params;
    // res.send(id);
    let deletedListing= await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
    console.log(deletedListing);
})) 

module.exports= router;