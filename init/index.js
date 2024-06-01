const mongoose= require("mongoose");    //mongoDB
const initData= require("./data");     //Data
const Listing= require("../models/listing");    //Schema
const mongoose_url= "mongodb://127.0.0.1:27017/wanderlust";

async function main(){
    await mongoose.connect(mongoose_url);
}

main().then((res)=>{console.log("Connected to Data.js")})
.catch((err)=>{console.log(err)});  

const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data Initialized");
}

initDB();

