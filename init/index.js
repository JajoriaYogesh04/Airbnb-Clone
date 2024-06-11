const mongoose= require("mongoose");    //mongoDB
const initData= require("./data");     //Data
const Listing= require("../models/listing");    //Schema
const mongoose_url= "mongodb://127.0.0.1:27017/wanderlust";

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= "pk.eyJ1IjoieW9nZXNoamFqb3JpYSIsImEiOiJjbHg4aDc3cWQyMG5vMmxzZG5oYWcxeW9yIn0.fewjvhz6YRrMLGyr_BM9EA";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

async function main(){
    await mongoose.connect(mongoose_url);
}

main().then((res)=>{console.log("Connected to Data.js")})
.catch((err)=>{console.log(err)});  

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj, owner: '665ebb64be2b80520519ba15'}));
    // console.log(initData);
    for(let obj of initData.data){
        let response = await geocodingClient
            .forwardGeocode({
                query: obj.location,
                limit: 2
            })
            .send();
        obj.geometry = response.body.features[0].geometry;
    }
    let listing= await Listing.insertMany(initData.data);
    console.log("Data Initialized");
}

initDB();

