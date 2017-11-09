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

var campgroundRoutes    = require("./routes/campgrounds");
var commentRoutes       = require("./routes/comments");
var indexRoutes         = require("./routes/index");

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

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp server running');
});