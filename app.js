var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seed");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp-camp", {useMongoClient: true});
app.set('view engine', 'ejs');
app.use( bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

seedDB();

//======================  
//PASSPORT CONFIGURATION
//======================
app.use(require("express-session")({
    secret: "This can be anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.userLogged = req.user;
   next();
});

//===============
//ROUTES
//===============
app.get('/', function(req,res){
   res.render('landing');
});

app.get('/campgrounds', function(req,res){
    
    Campground.find({},function(err, allCamps){
       if(err){
           console.log("Could not load campgrounds from db");
           console.log(err);
           
       } else{
           res.render("campgrounds/index", {campgrounds: allCamps});
           
       }
    });


});

//=================
//AUTH ROUTES
//=================

//Register Routes
app.get("/register", function(req, res) {
   res.render("register"); 
});

app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
function(req, res) {
});

//logout route
app.get("/logout", function(req, res) {
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

//=================
//CAMPGROUND ROUTES
//=================

//INDEX Route
app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    
    var newCampground = {name: name, image: image, description: description};
    
    //campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, camp){
        if(err){
            console.log("Error adding campground");
            console.log(err);
        }else{
            console.log("Campground added");
            console.log(camp);
            res.redirect('/campgrounds');
        }
    });
    
    
});

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
})

//SHOW Route
app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
           console.log("Error finding campground");    
           console.log(err);
        } else{
           console.log("Found Camp:")
           console.log(foundCampground);
           res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//---------------
//COMMENTS ROUTES
//---------------

//NEW Route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new", {campground: foundCampground });   
       }
    });
    
   
});

//CREATE Route
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    var newComment = req.body.comment;
    if(newComment){
        console.log(newComment);
        Comment.create(newComment, function(err, createdComment){
          if(err){
              console.log(err);
              res.redirect("/campgrounds/" + req.params.id);
          } else{
              Campground.findById(req.params.id, function(err, foundCampground) {
                  if(err){
                      console.log(err);
                      res.redirect("/campgrounds/" + req.params.id);
                  }else{
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();    
                    res.redirect("/campgrounds/" + req.params.id);
                  }
                  
              });
          }
        });
    }
    
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp server running');
});