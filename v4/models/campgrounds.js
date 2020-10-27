var mongoose=require("mongoose")
//Schema setup
var campgroundSchema=new mongoose.Schema({
    title:String,
    image:String,
    description:String,
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports=mongoose.model("Campground",campgroundSchema);