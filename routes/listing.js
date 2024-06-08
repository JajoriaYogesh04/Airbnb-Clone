const express= require("express");
const router= express.Router();
// const Listing= require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/expressError.js");
// const { listingSchema, reviewSchema} = require("../schema.js");
// const passport= require('passport');
const { isLoggedIn, isOwner, validateListing }= require("../middleware.js"); 
const listingControllers = require("../controllers/listing.js");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// Index-Create Route
router.route("/")
    .get(listingControllers.index) 
    // .post(validateListing, isLoggedIn, listingControllers.createListing);
    .post(upload.single('listing[image]'), (req, res)=>{
        // res.send(req.body);      
        res.send(req.file)
    }) 

//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewFrom)

// Show-Edit-Destroy Route
router.route("/:id")
    .get(listingControllers.showListing) 
    .put(validateListing, isLoggedIn, isOwner, listingControllers.updateListing) 
    .delete(isLoggedIn, isOwner, listingControllers.destroyListing) 

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingControllers.renderEditForm)

module.exports= router;