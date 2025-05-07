const express = require("express")
const userRouter = express.Router()
const {ConnectionRequestModel}= require("../model/connectionRequest")
const {UserModel}= require("../model/user")
const { userAuth } = require("../middleware/auth")

userRouter.get("/user/connectionRequests", userAuth, async(req, res)=>{
    const loggedInUser = req.user
    try{
        const connectionRequests = await ConnectionRequestModel.find({
            status: "interested",
            toUserId: loggedInUser._id
        }).populate("fromUserId", ["firstName", "lastName", "bio", "gender", "photoURL", "age"])
        res.json({data:connectionRequests})

    }catch(e){
        res.send("Error: "+ e.message )
    }
})

userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user
        const connections =  await ConnectionRequestModel.find({
            $or :[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"},     
            ]
        }).populate("fromUserId", ["firstName", "lastName","age", "gender", "photoURL"]).populate("toUserId", ["firstName", "lastName","age", "gender", "photoURL"])

        console.log(connections)

        const data= connections.map((each)=>{
            if(each.fromUserId._id.toString()===loggedInUser._id.toString()){
                return each.toUserId
            }
            return each.fromUserId
        })

        res.json({data})


    }catch(e){
        res.send("Error: "+ e.message)
    }
})

userRouter.get("/user/feed",userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user
        const page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 10
        limit>50? 50:limit
        const skip = (page-1)*limit
        console.log(skip)
        const connectionsAndRequests = await ConnectionRequestModel.find({
            $or: [{fromUserId:loggedInUser._id}, {toUserId:loggedInUser._id} ]
        })
       const hideUsersFromFeed = new Set()
       connectionsAndRequests.forEach((each)=>{
          hideUsersFromFeed.add(each.toUserId) 
          hideUsersFromFeed.add(each.fromUserId)
        }
      )
      const usersToShow = await UserModel.find({
        $and: [
            {_id : {$nin : Array.from(hideUsersFromFeed)}},
            {_id :{ $ne :loggedInUser._id}},
        ]
       
    }).select("firstName lastName bio photoURL skills gender")
    .skip(skip)
    .limit(limit)
      
      res.json({data:usersToShow})
    }
    catch(e){
        res.status(400).send("Error: "+ e.message)
    }
})

module.exports = {userRouter}