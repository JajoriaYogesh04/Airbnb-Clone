const express= require("express");
const app= express();
// const users= require("./routes/users");
// const posts= require("./routes/posts");
// const cookieParser= require("cookie-parser");
const session= require("express-session");

// app.use(cookieParser("secretcode"));

// app.get("/getcookies", (req, res)=>{
//     res.cookie("Country", "India");
//     res.cookie("State", "Rajasthan");
//     res.cookie("City", "Jaipur");
//     res.send("GET COOKIES");
// })

// app.get("/getsignedcookies", (req, res)=>{
//     res.cookie("made-in", "india", {signed: true});
//     res.send("GET SIGNED COOKIE");
// })

// app.get("/verify", (req, res)=>{
//     console.log(req.signedCookies);
//     res.send("VERIFY");
// })

// app.get("/", (req, res)=>{
//     res.send("GET request to root");
//     console.log("GET request to root");
//     console.dir(req.cookies);
// })

// app.get("/greets", (req, res)=>{
//     let { Name = "anonymous" }= req.cookies;
//     res.send(`Namaste ${ Name }`);
// })

// app.use("/users", users);

// app.use("/posts", posts);

app.use(session({secret: "mySecretString", resave: false, saveUninitialized: true}));

app.get("/test",(req, res)=>{
    res.send("Test Successful!");
})

app.get("/reqcount", (req, res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count= 1;
    }
    res.send(`Your request count is: ${req.session.count} times`);
})

app.listen(3000, ()=>{
    console.log("Listening to server 3000");
});