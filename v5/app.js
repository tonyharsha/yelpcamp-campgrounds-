var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    Campground=require("./models/campgrounds"),
    Comment=require("./models/comment"),
    seedDB= require("./seeds");
    
    
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))

seedDB();   
 

app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
   Campground.find({},function(error,allCampgrounds){
       if(error){
           console.log(error);
       }else{
          res.render("campgrounds/index",{campgrounds:allCampgrounds})  
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
    res.render("campgrounds/new")
})

//show route
app.get("/campgrounds/:id",function(req,res){
      //find the campground with provided id
      Campground.findById(req.params.id).populate("comments").exec(function(error,foundCampground){
          if(error){
              console.log(error);
          }else{
                //render show template with that campground
                // console.log(foundCampground)
             res.render("campgrounds/show",{campground:foundCampground});
          }
      })
})

// comment route

app.get("/campgrounds/:id/comments/new",function(req,res){
    Campground.findById(req.params.id,function(error,campground){
        if(error){
            console.log(error);
        }else{
           res.render("comments/new",{campground: campground}) 
        }
    })
    
})


// comment posting route
app.post("/campgrounds/:id/comments",function(req,res){
    Campground.findById(req.params.id,function(error,campground){
        if(error){
            console.log(error);
        }else{
            Comment.create(req.body.comment,function(error,comment){
                if(error){
                    console.log(error)
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp server started")
})