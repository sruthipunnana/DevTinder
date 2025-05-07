const express = require('express')
const bcrypt = require('bcrypt')
const {connectDB}= require("./config/database.js")
const {UserModel} = require("./model/user.js")
const {validateSignupData} = require("./utils/validate.js")
const {userAuth}= require("./middleware/auth")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const app = express()

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())


const {authRouter}= require("./routes/auth.js")
const {profileRouter}= require("./routes/profile.js")
const {requestsRouter}= require("./routes/requests.js")
const {userRouter} = require("./routes/user.js")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestsRouter)
app.use("/", userRouter)

connectDB()
.then(()=>{
  console.log("DB Connection has established!")
  app.listen(7000, ()=>{
    console.log("Server Started")})
})
.catch(()=>
  console.log("DB Connection has failed")
)

