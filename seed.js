var mongoose = require("mongoose"); 
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var newCamps = [
    {
        name: 'Elora Gorge',
        image: "https://farm1.staticflickr.com/69/191718791_fd179bc848.jpg",
        description: "best camp near home"
    },
    {
        name: 'Algonquin',
        image: "https://farm1.staticflickr.com/31/44649697_33a13fb3cf.jpg",
        description: "The trip will be worth it"
    },
    {
        name: 'Grand Bend',
        image: "https://farm5.staticflickr.com/4079/4805487492_618e66b63b.jpg",
        description: "Nothing like camp and have some vitamin sea"
    }];


function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err, removedCampgrounds){
        if(err){
            console.log(err);  
        }else{
            console.log("Campgrounds removed"); 
            //add some campgrounds
            Comment.remove({},function(err, removedComments){
                if(err){
                    console.log(err);
                    
                }else{
                    
                    console.log("Comments Removed");
                    
                    newCamps.forEach(function(val){
                       Campground.create(val, function(err,newCamp){
                          if(err){
                            console.log(err);
                          } else{
                            console.log("camp added");
                            Comment.create(
                                {
                                    text:"Greate place but i wish there was internet",
                                    author: "Pepito Perez"
                                    
                                }, function(err, createdComment){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        newCamp.comments.push(createdComment);
                                        newCamp.save();
                                        console.log("comment added");
                                    }
                                })
                          }
                       }); 
                    });   
                    
                }
            })
            
        }
    });
}



module.exports = seedDB;
