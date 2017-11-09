var express = require("express");
var router = express.Router();
var passport = require("passport");

var User = require("../models/user");

router.get('/', function(req,res){
   res.render('landing');
});



//=================
//AUTH ROUTES
//=================

//Register Routes
router.get("/register", function(req, res) {
   res.render("register"); 
});

router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   var password = req.body.password;
   User.register(newUser, password, function(err, user){
        if(err){
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds") 
        });
   }) 
});

//Login Routes
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("is logged in");
        return next();
    }
    res.redirect("/login");
}

module.exports = router;