const express= require("express");
const router= express.Router();
// const Listing= require("../models/listing.js");
// const wrapAsync= require("../utils/wrapAsync.js");
// const ExpressError= require("../utils/expressError.js");
// const { listingSchema, reviewSchema} = require("../schema.js");
// const passport= require('passport');
const { isLoggedIn, isOwner, validateListing }= require("../middleware.js"); 
const listingControllers = require("../controllers/listing.js");


//Index Route
router.get("/", listingControllers.index) 

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewFrom)

//Show Route
router.get("/:id", listingControllers.showListing) 

//Create Route
router.post("/", validateListing, isLoggedIn, listingControllers.createListing) 


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingControllers.renderEditForm)

//Update Route
router.put("/:id", validateListing, isLoggedIn, isOwner, listingControllers.updateListing) 

//Destroy Route
router.delete("/:id", isLoggedIn, isOwner, listingControllers.destroyListing) 

module.exports= router;