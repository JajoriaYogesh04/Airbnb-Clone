const express= require("express");
const router= express.Router();

router.get("/", (req, res)=>{
    console.log("GET request for user");
    res.send("GET request for user")
})
router.get("/:id", (req, res)=>{
    console.log("GET request for user id");
    res.send("GET request for user id")
})
router.post("/", (req, res)=>{
    console.log("POST request for user");
    res.send("POST request for user")
})
router.delete("/:id", (req, res)=>{
    console.log("DELETE request for user id");
    res.send("DELETE request for user id")
})

module.exports= router;