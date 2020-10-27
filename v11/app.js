var express=require("express"),
    app=express(),
    bodyparser=require("body-parser"),
    mongoose=require("mongoose"),
    passport=require("passport"),
    flash=require("connect-flash"),
    LocalStrategy=require("passport-local"),
    Campground=require("./models/campgrounds"),
    methodOverride=require("method-override"),
    Comment=require("./models/comment"),
    User=require("./models/user"),
    seedDB= require("./seeds");
    
// requiring routes
var Commentroute=require("./routes/comments"),
    Campgroundroute=require("./routes/campground"),
    indexroute=require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_campv6",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();   
 
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
     res.locals.error=req.flash("error");
     res.locals.success=req.flash("success");
     next();
 })
 
app.use("/",indexroute);
app.use("/campgrounds",Campgroundroute);
app.use("/campgrounds/:id/comments",Commentroute);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp server started")
})