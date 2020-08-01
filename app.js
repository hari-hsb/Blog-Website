const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose = require("mongoose");
const dotenv=require('dotenv');
dotenv.config();


const homeContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutC = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactC = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology: true});



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



const storiesSchema={
  title:String,
  content:String
};
const Story=mongoose.model("Story",storiesSchema);
app.get("/",function(req,res){

    Story.find({},function(err,result)
  {

     res.render("index",{homec:homeContent,stories:result});
  })

});
app.get("/contact",(req,res)=>
{
  res.render("contact",{homec:contactC});
});
app.get("/about",(req,res)=>
{
  res.render("about",{homec:aboutC});
});
app.get("/compose",(req,res)=>
{

  res.render("compose");
});
app.get("/edit",(req,res)=>
{

  res.render("edit");
});
app.get("/posts/:title",(req,res)=>
{

  const name=_.lowerCase(req.params.title);

  Story.findOne({title:name},(err,story)=>{
    if(!err)
    {
      if(story)
      {

        res.render("post",{title:story.title,content:story.content,id:story._id});
      }

    }
  });

});


app.post("/",(req,res)=>
{

  const id=req.body.id;
  const title=req.body.title;
  const content=req.body.content;
  Story.findOneAndUpdate({_id:id}, {title:title,content:content}, { new: true}, (err,foundlist)=>
{
  if(!err)
  {
    res.redirect("/");
  }
}) ;
});
app.post("/compose",(req,res)=>
{

  const title=_.lowerCase(req.body.title);
  const content=req.body.content;
  var count;
  Story.find().exec(function (err, results) {
   count = results.length;

   for(var i=0;i<count;i++)
   {
     if(results[i].title===title)
     {
       res.send("same title already present");
       return;
     }
   }
   const story=new Story({
     title:title,
     content:content
   });

   story.save();
res.send("welcome");
   // res.redirect("/");
  });


});

app.post("/edit",(req,res)=>
{
  const id=req.body.id;
  Story.findOne({_id:id},function(err,result)
{
  if(!err)
  {
    if(result)
    {
      res.render("edit",{title:result.title,content:result.content,id:result._id});
    }
  }

})



});

app.listen(3000,()=>
{
  console.log("listening on port 3000");
});
