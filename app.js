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
           res.render("campgrounds/index", {campgrounds: allCamps});
           
       }
    });


});

//-----------------
//CAMPGROUND ROUTES
//-----------------

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
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new", {campground: foundCampground });   
       }
    });
    
   
});

//CREATE Route
app.post("/campgrounds/:id/comments", function(req, res){
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