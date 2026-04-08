const express=require("express");
const session=require("express-session");
const cookieParser=require("cookie-parser");

const app=express();

app.use(cookieParser());

app.use(session({
    secret: "mySecretKey",
    resave:false,
    saveUnintialized:true
}));

app.get("/",(req,res)=> {
    res.send("Welcome! go to /login to start session.");
});

app.get("/login",(req,res)=> {
    req.session.username="Maneesha";
    res.send("Session created! Go to /profile");
});
app.get("/profile",(req,res)=> {
    if(req.session.username){
        res.send("Hello "+ req.session.username + " ");
    } else {
        res.send("No session found! Please login first.");
    }
});

app.get("/logout",(req,res)=> {
    req.session.destroy();
    res.send("Session destroyed!");
});

app.listen(3000,()=> {
    console.log("Server is running on http://localhost:3000");
});