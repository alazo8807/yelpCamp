var express = require("express");
var router = express.Router();
var methodOverride = require("method-override");

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.use(methodOverride("_method"));

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
                     
                    //Add id and username of the author to comment 
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    
                    //save the comment
                    createdComment.save();
                    
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();    
                    res.redirect("/campgrounds/" + req.params.id);
                  }
                  
              });
          }
        });
    }
});

//EDIT Route
router.get("/campgrounds/:campground_id/comments/:commment_id/edit", checkCommentOwnership, function(req,res){
    Comment.findById(req.params.commment_id, function(err, foundComment) {
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.campground_id, comment: foundComment});     
        }
    });
});

//UPDATE Route
router.put("/campgrounds/:campground_id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if (err) {
           console.log(err);
           res.redirect("back");
       } else{
           res.redirect("/campgrounds/" + req.params.campground_id);
       }
    });
});

router.delete("/campgrounds/:campground_id/comments/:comment_id", checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           console.log("there was an error");
           console.log(err);
           res.redirect("back");
       }else{
           console.log("comment deleted");
           res.redirect("/campgrounds/" + req.params.campground_id);
       }
   });
});

function checkCommentOwnership(req,res,next){
    if (req.isAuthenticated()) {
        //get the comment's author
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if (err) {
               console.log(err);
               res.redirect("back");
           } else{
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               } else{
                   res.redirect("back");
               }
           }
        });
        //check if comment's author is the user logged in
        
    }else{
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        console.log("is logged in");
        return next();
    }
    res.redirect("/login");
}

module.exports = router;