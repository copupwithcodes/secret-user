//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const  mongoose  = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.set('strictQuery', true);

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const userSchema = new mongoose.Schema({
    email : String,
    password : String
})
console.log(process.env.API_KEY);
userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User", userSchema);
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

app.get("/", function(req,res){
    res.render("home")
})
app.get("/login", function(req,res){
    res.render("login")
});
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    const newUser = new User({
        email : req.body.email,
        password : req.body.password
    })
    newUser.save(function(err){
        if(!err)
          res.render("Secrets");
    })
})
app.post("/login", function(req,res){
    const username = req.body.email;
    const password = req.body.password;
    User.findOne({email : username} ,function(err,foundUser){
        if(err)
        console.log(err);
        else{
            if(foundUser){
                if(foundUser.password === password)
                  res.render("Secrets");
            }
        }
    });
});
app.listen(3000, function(req,res){
    console.log("server is running on 3000");
})