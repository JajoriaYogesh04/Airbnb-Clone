const express= require("express");
const app= express();
// const users= require("./routes/users");
// const posts= require("./routes/posts");
// const cookieParser= require("cookie-parser");
const session= require("express-session");
const flash= require("connect-flash");
const path= require("path");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

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

const sessionOptions= {
    secret: "mySecretString", 
    resave: false, 
    saveUninitialized: true
}

app.use(session(sessionOptions));
app.use(flash());

// app.get("/test",(req, res)=>{
//     res.send("Test Successful!");
// })

// app.get("/reqcount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count= 1;
//     }
//     res.send(`Your request count is: ${req.session.count} times`);
// })

app.get("/register", (req, res)=>{
    let {name="Anonymous"}= req.query;
    req.session.name= name;
    // res.send(`Registered Name: ${req.session.name}`);
    console.log(req.session);
    req.flash("register", "User Registered Successfully");
    res.redirect("/hello");

})
app.get("/hello", (req, res)=>{
    console.log(req.session);
    // res.send(`Hello ${req.session.name}`);
    res.render("hello.ejs", {name: req.session.name, msg: req.flash("register")});
})

app.listen(3000, ()=>{
    console.log("Listening to server 3000");
});