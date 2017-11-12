//=================
//CAMPGROUND ROUTES
//=================

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var methodOverride = require("method-override");

router.use(methodOverride("_method"));


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

//CREATE Route
router.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newCampground = {name: name, image: image, description: description, author: author};
    
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

router.get("/campgrounds/new", isLoggedIn, function(req, res) {
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

//EDIT Route
router.get("/campgrounds/:id/edit",checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
      res.render("campgrounds/edit", {campground: foundCampground});    
    }); 
  
});

//UPDATE Route
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground ,function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Route
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
        
    }); 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("is logged in");
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req,res,next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
          if(err){
              console.log(err);
              res.redirect("back");
          }else{
              //is it the owner of the campground
              if (foundCampground.author.id.equals(req.user._id)) {
                  next();    
              }else{
                  res.redirect("back");
              }
          }
        });    
    }else{
        res.redirect("back");
    
    }
}


module.exports = router;