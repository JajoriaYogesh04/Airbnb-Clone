const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const reviewSchema= new Schema({
    rating:{
        type: Number,
        min: 0,
        max: 5,
    },
    comment: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

const Review= mongoose.model("Review", reviewSchema);

module.exports= Review;

