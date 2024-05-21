const express= require("express");
const mongoose= require("mongoose");
const app= express();
const port= 8080;
const mongoose_url= "mongodb://127.0.0.1:27017/wanderlust";
const Listing= require("./models/listing.js");
const path= require("path");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

async function main(){
    await mongoose.connect(mongoose_url); 
}

main().then(()=>{console.log("Connected to Mongoose")})
.catch((err)=>{console.log(err)});

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
app.get("/listing", async (req, res)=>{
    const allListing= await Listing.find({});
    res.render("index.ejs", { allListing });
})

//Show Route
app.get("/listing/:id", async (req, res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    console.log(`Getting request on ID`);
    // res.send(showData);
    // console.log(showData);
    res.render("show.ejs", { listing });
})

app.listen(port, ()=>{
    console.log("Listening to port 8080");
})