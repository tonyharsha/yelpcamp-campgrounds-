var express=require("express");
var router=express.Router();
// var sanitizer=require("express-sanitizer");
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");

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
router.post("/",middleware.isLoggedIn,function(req,res){
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
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new")
})

//show route
router.get("/:id",function(req,res){
      //find the campground with provided id
      //comment are stored as objectid's in array to dispaly the actual comment we use populate function which extrat the string from thst objectid
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

// Edit campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(error,foundCampground){
               res.render("campgrounds/edit",{campground:foundCampground})  
        })
    }) 
   

//update campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(error,updatedCampground){
        if(error){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
    //redirect to updated campground(show page)
})

//delete campground
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(error){
        if(error){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})



module.exports=router;