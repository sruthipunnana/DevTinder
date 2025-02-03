const express = require('express')
const app = express()
// app.use((req, res)=>{
//     res.send("Handles all request handlers")
// })

app.use('/test',(req,res)=>{
  res.send("/test route is working")
})

app.use('/hello',(req,res)=>{
    res.send("/hello is working")
  })

app.listen(7000, ()=>{
    console.log("Server Started")
})