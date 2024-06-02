const express= require("express");
const mongoose= require("mongoose");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");

const app= express();
const port= 8080;
const mongoose_url= "mongodb://127.0.0.1:27017/wanderlust";
// const Listing= require("./models/listing.js");
const path= require("path");
// const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/expressError.js");
// const { listingSchema, reviewSchema} = require("./schema.js");
// const Review= require("./models/review.js");

const listings= require("./routes/listing.js")
const reviews= require("./routes/review.js")

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

//Set up
app.get("/", (req, res)=>{
    console.log("Index Route Successfully");
    res.send("Index Route Successfully");
})

// app.get("/testListing", async (req, res)=>{
//     let sampleListing= new Listing({
//         title: "My New Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })
//     await sampleListing.save().then((res)=>{console.log(res)})
//     .catch((err)=>{console.log(err)});
//     res.send("Listing Test Successfully");
// })

app.use("/listing", listings);

app.use("/listing/:id/reviews", reviews);


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

