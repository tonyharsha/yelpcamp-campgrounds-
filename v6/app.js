var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    LocalStrategy=require("passport-local"),
    Campground=require("./models/campgrounds"),
    Comment=require("./models/comment"),
    User=require("./models/user"),
    seedDB= require("./seeds");
    
    
mongoose.connect("mongodb://localhost/yelp_campv6",{ useNewUrlParser: true,useUnifiedTopology: true });
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))

seedDB();   
 
 //passport configuration
 app.use(require("express-session")({
    secret:"harsha",
    resave:false,
    saveUninitialized:false
 }));
 app.use(passport.initialize());
 app.use(passport.session());
 
 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());
 
 // to retrive the information of the user such as usename,userid and pass the data to all templates.
 app.use(function(req,res,next){
     res.locals.currentUser=req.user;
     next();
 })
 

app.get("/",function(req,res){
    res.render("landing")
})

//index show all campgrounds
app.get("/campgrounds",function(req,res){
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

//new show form to create a new campground
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(error,campground){
        if(error){
            console.log(error);
        }else{
           res.render("comments/new",{campground: campground}) 
        }
    })
    
})


// comment posting route
app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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

//================================
//Auth routs
//================================

//register route
app.get("/register",function(req,res){
    res.render("register");
})

//handling singup logic
app.post("/register",function(req,res){
    var newUser =new User({username:req.body.username});
    User.register(newUser,req.body.password,function(error,user){
        if(error){
            console.log(error);
            res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        })
    })
})

//login route
app.get("/login",function(req,res){
    res.render("login");
})

//handling login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
})

//logout route
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp server started")
})