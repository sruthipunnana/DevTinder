const mongoose = require("mongoose");
const validator= require("validator");
const bcrypt = require("bcrypt")
const jwt= require("jsonwebtoken")
const { Schema } = mongoose;


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength:3,
        maxLength:50,
    },
    lastName: {
        type: String,
        required: true,
        minLength:3,
        maxLength:50,

    },
    age: {
        type: Number,
        min:18,
        max:100,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique:true, 
        trim: true, 
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Format")
            }
        }
    },
    password: {
        type: String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password")
            }
        }
    },
    bio: {
        type: String,
        default: "Hello all, Welcome to my Profile!",
        maxLength:4000,
    },
    photoURL: {
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a valid URL")
            }
        },
        default:"https://fastly.picsum.photos/id/827/200/300.jpg?hmac=0Q7y5JGXuxSXgO7VUvdNhXC4yoAupOJiKmRS9RoPqs8"
    },
    gender: {
        type: String,
        lowercase:true,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is invalid")
            }
        }
    },
    skills: {
        type: [String],
        
    },
    

}, {timestamps:true});

userSchema.methods.getJwt= async function(){
    const user= this
    const token = await jwt.sign({_id : user._id}, "devTinder@123", {expiresIn:'7d'})
    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user= this
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password)
    return isPasswordValid
}

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
