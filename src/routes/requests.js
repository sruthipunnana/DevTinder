const express = require("express")
const {userAuth} = require("../middleware/auth")
const {ConnectionRequestModel} = require("../model/connectionRequest")
const {UserModel} = require("../model/user")
const requestsRouter = express.Router()

requestsRouter.post("/connection/:status/:toUserId", userAuth, async(req,res)=>{
  try{
    const fromUserId= req.user._id
    const {status, toUserId} = req.params

    const ALLOWED_STATUS= ["ignored", "interested"]
    // validate status
    if(!ALLOWED_STATUS.includes(status)){
      throw new Error("Please enter a valid status")
    }

    // check if toUserId is present in DB
    const isToUserIdPresent = await UserModel.findById(toUserId)
    if(!isToUserIdPresent){
      throw new Error("Cannot find the user!");
    }

    // fromUserId should not be equal to toUserId
    if(fromUserId.equals(toUserId)){
      throw new Error("Cannot send request to yourself");
    }

    // check if there is existing connection
    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $or: [{
        toUserId, fromUserId
      }, {
        fromUserId:toUserId, toUserId:fromUserId
      }]
    })
    if(existingConnectionRequest){
      throw new Error("Connection Request already exists")
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId, toUserId, status
    })
    await connectionRequest.save()
    res.json({
      message: status==="interested"? `${req.user.firstName} is interested in ${isToUserIdPresent.firstName}`:  `${req.user.firstName} ignored ${isToUserIdPresent.firstName}`
    })

  }catch(e){
    res.status(400).send("Error: "+ e.message)
  }   
  })

requestsRouter.post("/connection/review/:status/:requestId",userAuth, async(req,res)=>{
  try{
    const loggedInUser= req.user
    const {status, requestId}= req.params

    // validate status
    const ALLOWED_STATUS = ["rejected", "accepted"]
    if(!ALLOWED_STATUS.includes(status)){
      throw new Error("Status is not allowed!")
    }

    // validate if requestId exists, toUser is loggedInUser and status is interested
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id:requestId,
      toUserId: loggedInUser._id,
      status:"interested"
    })
    console.log(connectionRequest)
    if(!connectionRequest){
      throw new Error("Connection request does not exist!")
    }
    connectionRequest.status = status
    const data = await connectionRequest.save()
    res.json({
      data
    })

  }
  catch(e){
    res.status(400).send("Error: "+ e.message)

  }
})


module.exports= {requestsRouter}