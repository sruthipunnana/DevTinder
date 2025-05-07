const express = require('express')
const app = express()

// app.use("/",(req, res)=>{
//     res.send("Handles all request handlers")
// })

// http methods

app.get("/user", (req,res)=>{
  res.send("Get method is working")
})

app.post("/user", (req,res)=>{
  res.send("Post method is working")
})

