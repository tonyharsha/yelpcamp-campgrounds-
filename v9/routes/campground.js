var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");

//index show all campgrounds
router.get("/",function(req,res){
    //get all campgrounds from db
   Campground.find({},function(error,allCampgrounds){
       if(error){
           console.log(error);
       }else{
          res.render("campgrounds/index",{campgrounds:allCampgrounds})  
       }
   })
   
})

//create add new campground to db
//create route
router.post("/",isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.desc;
    var author={
        id: req.user._id,
        username:req.user.username
    };
    var newcampground={ title: name , image: image, description:desc,author:author}
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

//new show form to create a new campground
router.get("/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new")
})

//show route
router.get("/:id",function(req,res){
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

// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports=router;