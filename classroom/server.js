const express= require("express");
const app= express();
const users= require("./routes/users");
const posts= require("./routes/posts");

app.get("/", (req, res)=>{
    res.send("GET request to root");
    console.log("GET request to root");
})

app.use("/users", users);

app.use("/posts", posts);

app.listen(3000, ()=>{
    console.log("Listening to server 3000");
});