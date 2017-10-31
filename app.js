var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seed");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp-camp", {useMongoClient: true});
app.set('view engine', 'ejs');
app.use( bodyParser.urlencoded({extended: true}));

seedDB();
   
app.get('/', function(req,res){
   res.render('landing');
});

app.get('/campgrounds', function(req,res){
    
    Campground.find({},function(err, allCamps){
       if(err){
           console.log("Could not load campgrounds from db");
           console.log(err);
           
       } else{
           res.render("index", {campgrounds: allCamps});
           
       }
    });


});

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
    res.render("new")
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
           res.render("show", {campground:foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp server running');
});