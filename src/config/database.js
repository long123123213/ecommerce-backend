const mongoose = require("mongoose");
const connectDB= async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connect database successful");
    }
    catch(error){
        console.error("MongoDB error :",error);
        process.exit(1);
    }
};

module.exports=connectDB;
