const mongoose=require("mongoose");

const categorySchema=new mongoose.Schema({
nameCategory:{type : String,required:true},
});

module.exports=mongoose.model("Category",categorySchema);