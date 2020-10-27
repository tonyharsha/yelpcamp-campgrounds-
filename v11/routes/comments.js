var express=require("express");
var router=express.Router({mergeParams: true});
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middleware=require("../middleware");

//==================
// comment route
//=================

//comment new
router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(error,campground){
        if(error){
            console.log(error);
        }else{
           res.render("comments/new",{campground: campground}) 
        }
    })
    
})


// comment posting route
//commment create
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(error,campground){
        if(error){
            console.log(error);
        }else{
            Comment.create(req.body.comment,function(error,comment){
                if(error){
                    console.log(error)
                }else{
                    comment.author._id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment!!")
                    res.redirect("/campgrounds/"+campground._id)
                }
            })
        }
    })
})

//edit route for comments
router.get("/:comment_id/edit",function(req,res){
    Comment.findById(req.params.comment_id,function(error, foundComment) {
        if(error){
            res.redirect("back")
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})
        }
    })
})

//update route for comments
router.put("/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(error,updateComment){
        if(error){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

//delete comment
router.delete("/:comment_id",function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(error){
        if(error){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})





module.exports=router;