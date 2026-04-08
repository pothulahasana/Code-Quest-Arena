const express = require("express");
const path = require("path");
const app=express();

//set EJS as template engine
app.set("view engine","ejs");

//optional :Set views folder manually
app.set("views",path.join(__dirname,"views"));

//Route
app.get("/",(req, res) => {
    const user="Maneesha";
    const marks=100;

    res.render("Home", {
        name:user,
        score:marks
    });
});

//start server
app.listen(4000,()=>{
    console.log("server running on http://localhost:4000")
});