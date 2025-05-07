const mongoose = require("mongoose")


const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://sruthipunnana:rJThWFqc9YKdOt3U@namasthenodejs.a0mv6.mongodb.net/devTinder")
}

module.exports ={connectDB}
