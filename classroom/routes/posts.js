const express= require("express");
const router= express.Router();

router.get("/", (req, res)=>{
    console.log("GET request for posts");
    res.send("GET request for posts")
})
router.get("/:id", (req, res)=>{
    console.log("GET request for posts id");
    res.send("GET request for posts id")
})
router.post("/", (req, res)=>{
    console.log("POST request for posts");
    res.send("POST request for posts")
})
router.delete("/:id", (req, res)=>{
    console.log("DELETE request for posts id");
    res.send("DELETE request for posts id")
})

module.exports= router;