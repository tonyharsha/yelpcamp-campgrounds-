var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")

//Schema setup
var campgroundSchema=new mongoose.Schema({
    title:String,
    image:String,
    description:String
});

var Campground=mongoose.model("Campground",campgroundSchema);
// Campground.create( {
//     title:"Holiday Park", 
//     image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSyYUClygEr9CFWSziuXXKmcNdsGGlWMmlOSg&usqp=CAU",
//     description:"this is a great hoiiday pacakage to enjoy great exprences!!!"
//   },function(error,campground){
//     if(error){
//         console.log(error);
//     }else{
//         console.log("campgrounde added");
//         console.log(campground)
//     }
// })


app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
   Campground.find({},function(error,allCampgrounds){
       if(error){
           console.log(error);
       }else{
          res.render("index",{campgrounds:allCampgrounds})  
       }
   })
   
})

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.desc;
    var newcampground={ title: name , image: image, description:desc}
    //create a new campground and save to database
    Campground.create(newcampground,function(error,newlycreated){
        if(error){
            console.log(error);
        }else{
             //redirect back yo campgrounds
             res.redirect("/campgrounds")
        }
    })
})


app.get("/campgrounds/new",function(req,res){
    res.render("new")
})

app.get("/campgrounds/:id",function(req,res){
      //find the campground with provided id
      Campground.findById(req.params.id,function(error,foundCampground){
          if(error){
              console.log(error);
          }else{
                //render show template with that campground
             res.render("show",{campground:foundCampground});
          }
      })
})


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp server started")
})