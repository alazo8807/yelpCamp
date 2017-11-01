var mongoose = require("mongoose"); 
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var newCamps = [
    {
        name: 'Elora Gorge',
        image: "https://farm1.staticflickr.com/69/191718791_fd179bc848.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: 'Algonquin',
        image: "https://farm1.staticflickr.com/31/44649697_33a13fb3cf.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: 'Grand Bend',
        image: "https://farm5.staticflickr.com/4079/4805487492_618e66b63b.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }];


function seedDB(){
    //remove all campgrounds
    Campground.remove({}, function(err, removedCampgrounds){
        if(err){
            console.log(err);  
        }else{
            console.log("Campgrounds removed"); 
            
            //Remove all comments
            Comment.remove({},function(err, removedComments){
                if(err){
                    console.log(err);
                    
                }else{
                    
                    console.log("Comments Removed");
                    
                    //add some campgrounds
                    newCamps.forEach(function(val){
                       Campground.create(val, function(err,newCamp){
                          if(err){
                            console.log(err);
                          } else{
                            console.log("camp added");
                            
                            //Create comment
                            Comment.create(
                                {
                                    text:"Greate place but i wish there was internet",
                                    author: "Pepito Perez"
                                    
                                }, function(err, createdComment){
                                    if(err){
                                        console.log(err);
                                    }else{
                                        //insert the commment in each campground
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
