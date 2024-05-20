const express= require("express");
const mongoose= require("mongoose");
const app= express();
const port= 8080;
const mongoose_url= "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(mongoose_url); 
}

main().then(()=>{console.log("Connected to Mongoose")})
.catch((err)=>{console.log(err)});

app.get("/", (req, res)=>{
    console.log("Index Route Successfully");
    res.send("Index Route Successfully");
})

app.listen(port, ()=>{
    console.log("Listening to port 8080");
})