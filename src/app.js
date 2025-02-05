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

app.delete("/user", (req,res)=>{
  res.send("delete method is working")
})

app.patch("/user", (req,res)=>{
  res.send("patch method is working")
})

// 

// any method, same output for route if we use "use"

app.use('/test/2',(req,res)=>{
  res.send("/test route 2 is working")
})

app.use('/test',(req,res)=>{
  res.send("/test route is working")
})


app.use('/hello',(req,res)=>{
    res.send("/hello is working")
  })

app.listen(7000, ()=>{
    console.log("Server Started")
})