var express=require("express");
var app=express();
var bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))
app.set("view engine","ejs")

 var campgrounds=[
        {title:"Beach campain", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSabmC-wYjUAowZxOu6YW_nuUBtnoIHhZ6aaQ&usqp=CAU"},
        {title:"DNR Forest", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTdxPVuez0EJELRSom7srGeYhbvJeuumG75qA&usqp=CAU"},
        {title:"Holiday Park", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSyYUClygEr9CFWSziuXXKmcNdsGGlWMmlOSg&usqp=CAU"},
        {title:"Beach campain", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSabmC-wYjUAowZxOu6YW_nuUBtnoIHhZ6aaQ&usqp=CAU"},
        {title:"DNR Forest", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTdxPVuez0EJELRSom7srGeYhbvJeuumG75qA&usqp=CAU"},
        {title:"Holiday Park", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSyYUClygEr9CFWSziuXXKmcNdsGGlWMmlOSg&usqp=CAU"},
        {title:"Beach campain", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSabmC-wYjUAowZxOu6YW_nuUBtnoIHhZ6aaQ&usqp=CAU"},
        {title:"DNR Forest", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTdxPVuez0EJELRSom7srGeYhbvJeuumG75qA&usqp=CAU"},
        {title:"Holiday Park", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSyYUClygEr9CFWSziuXXKmcNdsGGlWMmlOSg&usqp=CAU"},
        {title:"Holiday Park", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSyYUClygEr9CFWSziuXXKmcNdsGGlWMmlOSg&usqp=CAU"},
        {title:"Beach campain", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSabmC-wYjUAowZxOu6YW_nuUBtnoIHhZ6aaQ&usqp=CAU"},
        {title:"DNR Forest", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTdxPVuez0EJELRSom7srGeYhbvJeuumG75qA&usqp=CAU"},
        {title:"Holiday Park", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSyYUClygEr9CFWSziuXXKmcNdsGGlWMmlOSg&usqp=CAU"},
        
        ]

app.get("/",function(req,res){
    res.render("landing")
})

app.get("/campgrounds",function(req,res){
   
    res.render("campgrounds",{campgrounds:campgrounds})
})

app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var newcampground={ title: name , image: image}
    campgrounds.push(newcampground)
    res.redirect("/campgrounds")
    
})


app.get("/campgrounds/new",function(req,res){
    res.render("new")
})




app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp server started")
})