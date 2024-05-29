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
const { listingSchema } = require("./schema.js");

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
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

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

//Set up
app.get("/", (req, res)=>{
    console.log("Index Route Successfully");
    res.send("Index Route Successfully");
})

//Index Route
app.get("/listing", wrapAsync(async (req, res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs", { allListing });
})) 

//New Route
app.get("/listing/new", (req, res)=>{
    console.log("Getting New Request");
    // res.send("Getting New Request");
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listing/:id", wrapAsync(async (req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    console.log(`Show request on ID`);
    // res.send(showData);
    // console.log(showData);
    res.render("listings/show.ejs", { listing });
})) 

//Create Route
app.post("/listing", validateListing,wrapAsync(async (req, res, next)=>{
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
app.get("/listing/:id/edit", wrapAsync(async (req, res)=>{
    let { id }= req.params;
    // console.log(`Edit request by: ${id}`);
    let editListing= await Listing.findById(id);
    console.log(editListing);
    // res.send(`Edit request by: ${id}`);
    res.render("listings/edit.ejs", { editListing });
}))

//Update Route
app.put("/listing/:id", wrapAsync(async (req, res)=>{
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
app.delete("/listing/:id", wrapAsync(async (req, res)=>{
    let { id }= req.params;
    // res.send(id);
    let deletedListing= await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
    console.log(deletedListing);
})) 

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
