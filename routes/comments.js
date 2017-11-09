var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");

//---------------
//COMMENTS ROUTES
//---------------

//NEW Route
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
           res.render("comments/new", {campground: foundCampground });   
       }
    });
    
   
});

//CREATE Route
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("is logged in");
        return next();
    }
    res.redirect("/login");
}

module.exports = router;