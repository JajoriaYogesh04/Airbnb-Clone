const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const Review= module.require("./review.js");

const listingSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1504714146340-959ca07e1f38?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v)=>
            v===""?"https://images.unsplash.com/photo-1504714146340-959ca07e1f38?q=80&w=1450&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        result= await Review.deleteMany({_id: {$in: listing.review}});
        console.log(result);
    }
})

const Listing= mongoose.model("Listing", listingSchema);
module.exports= Listing;
