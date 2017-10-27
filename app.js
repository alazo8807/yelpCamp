var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use( bodyParser.urlencoded({extended: true}));

var campgrounds = [
   {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
   {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
   {name: "Mountain's goeat Rest", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
   {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
   {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
   {name: "Mountain's goeat Rest", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"},
   {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
   {name: "Granite Hill", image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg"},
   {name: "Mountain's goeat Rest", image: "https://farm1.staticflickr.com/22/31733208_3190a1e982.jpg"}
];
   
app.get('/', function(req,res){
   res.render('landing');
});

app.get('/campgrounds', function(req,res){
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    
    res.render('campgrounds',{campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res) {
    res.render("new")
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp server running');
});