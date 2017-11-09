//=================
//CAMPGROUND ROUTES
//=================

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//INDEX Route
router.get('/campgrounds', function(req,res){
    
    Campground.find({},function(err, allCamps){
       if(err){
           console.log("Could not load campgrounds from db");
           console.log(err);
           
       } else{
           res.render("campgrounds/index", {campgrounds: allCamps});
           
       }
    });


});

router.post('/campgrounds', function(req, res){
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

router.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new")
})

//SHOW Route
router.get("/campgrounds/:id", function(req,res){
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



module.exports = router;