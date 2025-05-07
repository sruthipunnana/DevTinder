const express = require("express")
const authRouter = express.Router()
const {validateSignupData} = require("../utils/validate")
const bcrypt = require("bcrypt")
const {UserModel} = require("../model/user")

authRouter.post("/signup", async(req,res)=>{
    try{
      // Validate request body
      validateSignupData(req)
      const {firstName, lastName, email, password} = req.body
     // Hash password
      const passwordHash = await bcrypt.hash(password, 10)
      // create a new instance of a user using userModel
      const user= new UserModel(
        {
          firstName, lastName, email, password:passwordHash
        }
      )
   
     await user.save()
     res.send("User Added Successfully")
    }
    catch(e){
     res.status(400).send("Error:"+ e.message)
    }
     
   })
   
authRouter.post("/login", async(req, res)=>{
     const {email,password} = req.body 
     // check if user exists or not
     try{
       const user = await UserModel.findOne({email})
       if(!user){
         throw new Error("Invalid credentials")
       }
       // check if password is valid
       const isValidPassword = await user.validatePassword(password)
       console.log(isValidPassword)
       if(isValidPassword){
         // create a jwt token 
         const token =  await user.getJwt()
         // store the token in cookie, send it to client
         res.cookie("token", token, {expires: new Date(Date.now() + 900000)})
         res.json({data:user})
       }
       else{
         throw new Error("Invalid credentials")
       }
     }
     catch(e){
       res.status(400).send(e.message)
     }
   
   })

authRouter.post("/logout", async(req,res)=>{
    res
    .cookie("token", null, {expires: new Date(Date.now())})
    .send("Logout Success!")
    
})

module.exports ={authRouter}