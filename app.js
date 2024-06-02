const express= require("express");
const mongoose= require("mongoose");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");

const app= express();
const port= 8080;
const mongoose_url= "mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("./models/listing.js");
const path= require("path");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/expressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");
const Review= require("./models/review.js");
const listings= require("./routes/listing.js")

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

async function main(){
    await mongoose.connect(mongoose_url); 
}

main().then(()=>{console.log("Connected to Mongoose")})
.catch((err)=>{console.log(err)});

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
    console.log(error);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }   
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    // console.log(error);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }   
};

app.use("/listing", listings);

//Set up
app.get("/", (req, res)=>{
    console.log("Index Route Successfully");
    res.send("Index Route Successfully");
})

// REVIEWS
// Post Review Route
app.post("/listing/:id/reviews", validateReview, wrapAsync(
    async(req, res)=>{
        let { id } = req.params;
        // console.log(id);
        let listing= await Listing.findById(id);
        // console.log(listing);
        let reviewBody = req.body.review;
        console.log(reviewBody);
        let newReview= new Review(reviewBody);
        // console.log(newReview);
        listing.review.push(newReview);
        await listing.save();
        await newReview.save();
        // res.send("New Review Saved");
        console.log("New Review Saved");
        res.redirect(`/listing/${id}`);
    }
))

// Delete Review Route
app.delete("/listing/:id/reviews/:reviewId", wrapAsync(
    async(req, res)=>{
        let {id, reviewId}= req.params;
        // console.log(id);
        // console.log(reviewId);
        let deleteReview= await Review.findByIdAndDelete(reviewId);
        let reviewListing= await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
        console.log(deleteReview);
        console.log(reviewListing);
        res.redirect(`/listing/${id}`);
    }
))


app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})
 
// app.use((err, req, res, next)=>{
//     // res.send(err.message);
//     res.send("Something went WRONG");
// })

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went WRONG"}= err;
    // res.status(statusCode).send(message)
    // res.send(err);
    res.status(statusCode).render("error.ejs", { err });
})

app.listen(port, ()=>{
    console.log("Listening to port 8080");
})

