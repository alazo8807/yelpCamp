var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp-camp", {useMongoClient: true});
app.set('view engine', 'ejs');
app.use( bodyParser.urlencoded({extended: true}));

var campgroundsSchema = new mongoose.Schema({
    name: String, 
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundsSchema);

// Campground.create({
//     name: "Salmon Creek",
//     image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
//     description: "This is a testing description"
// }, function(err, camp){
//     if(err){
//         console.log("Error adding campground");
//         console.log(err);
//     }else{
//         console.log("campground Added");
//         console.log(camp);
//     }
// });

// var campgrounds = [
//   {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//   {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
//   {name: "Mountain's goeat Rest", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
//   {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//   {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
//   {name: "Mountain's goeat Rest", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
//   {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
//   {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
//   {name: "Mountain's goeat Rest", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"}
// ];

   
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

app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else{
           console.log(foundCampground);
           res.render("show", {campground: foundCampground});
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp server running');
});