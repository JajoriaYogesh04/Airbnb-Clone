const express= require("express");
const app= express();
const users= require("./routes/users");
const posts= require("./routes/posts");
const cookieParser= require("cookie-parser");

app.use(cookieParser());

app.get("/getcookies", (req, res)=>{
    res.cookie("Country", "India");
    res.cookie("State", "Rajasthan");
    res.cookie("City", "Jaipur");
    res.send("GET COOKIES");
})

app.get("/", (req, res)=>{
    res.send("GET request to root");
    console.log("GET request to root");
    console.dir(req.cookies);
})

app.get("/greets", (req, res)=>{
    let { Name = "anonymous" }= req.cookies;
    res.send(`Namaste ${ Name }`);
})

app.use("/users", users);

app.use("/posts", posts);

app.listen(3000, ()=>{
    console.log("Listening to server 3000");
});