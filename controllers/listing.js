const wrapAsync= require("../utils/wrapAsync.js");
const Listing= require("../models/listing");
const ExpressError= require("../utils/expressError.js");
const { listingSchema, reviewSchema} = require("../schema.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = wrapAsync(async (req, res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs", { allListing });
})

module.exports.renderNewFrom= (req, res)=>{
    console.log("Getting New Request");
    // if(!req.isAuthenticated()){
    //     req.flash("error", "Please Login to continue...");
    //     res.redirect("/login");
    // }
    // res.send("Getting New Request");
    res.render("listings/new.ejs");
}

module.exports.showListing= wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({
        path: "review",
        populate: {
            path: "author"
        }
    }).populate("owner");
    // console.log(listing.review.author);
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listing")
    }
    console.log(`Show request on ID`);
    // res.send(showData);
    // console.log(showData);
    res.render("listings/show.ejs", { listing });
})

module.exports.createListing= wrapAsync(async (req, res, next)=>{
    let response= await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 2
        })
        .send()
    // console.log(response);
    // console.log(response.body.features[0].geometry);
    // res.send("done");

    let url= req.file.path;
    let filename= req.file.filename;
    req.flash("success", "New Listing Created!");
    let listing = req.body.listing;
    // console.log(listing);
    // res.send(req.body.listing);
    // console.log(listing);
    // if(!listing){
    //     throw new ExpressError(400, "Send Valid Data For Listing");
    // }
    let newListing= new Listing(listing);
    newListing.owner= req.user._id;
    newListing.geometry= response.body.features[0].geometry;
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
    newListing.image= { url, filename };
    let savedListing= await newListing.save();
    console.log(savedListing);
    res.redirect("/listing");   
})

module.exports.renderEditForm= wrapAsync(async (req, res)=>{
    let { id }= req.params;
    // let listing= await Listing.findById(id);
    // if(!res.locals.currUser._id.equals(listing.owner._id)){
    //     req.flash("error", "Authorization Error: You are not the owner of this listings");
    //     res.redirect("/listing");
    // }
    // console.log(`Edit request by: ${id}`);
    let editListing= await Listing.findById(id);
    if(!editListing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listing");
    }
    let originalImage= editListing.image.url;
    let originalImageUrl= originalImage.replace("/upload", "/upload/h_200")
    console.log(editListing);
    // res.send(`Edit request by: ${id}`);
    res.render("listings/edit.ejs", { editListing, originalImageUrl });
})

module.exports.updateListing= wrapAsync(async (req, res)=>{
    req.flash("success", "Listing Updated!");
    let { id }= req.params;
    let editRequest= {...req.body.listing};
    // console.log(id);
    // res.send(editRequest);
    if(!editRequest){
        throw new ExpressError(400, "Send Valid Data For Listing");
    }
    listing= await Listing.findByIdAndUpdate(id, editRequest, {new: true, runValidators: true})
    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename= req.file.filename;
        listing.image= {url, filename};
        await listing.save();
    }
    res.redirect(`/listing/${id}`);
})

module.exports.destroyListing= wrapAsync(async (req, res)=>{
    req.flash("success", "Listing Deleted!");
    let { id }= req.params;
    // res.send(id);
    let deletedListing= await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
    console.log(deletedListing);
})