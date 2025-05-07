const validator = require("validator")

const validateSignupData=(req)=>{
 const {firstName, lastName, email, password}= req.body
 if(!firstName || !lastName){
    throw new Error("Name not found")
 }
 else if(!validator.isEmail(email)){
    throw new Error("Please enter valid email")
 }
 else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter strong password!")
 }
}

const validateLoginData= (req)=>{
   const {email}= req.body
   if(!validator.isEmail(email)){
      throw new Error("Please enter valid email")
   }
}

module.exports = {validateSignupData}