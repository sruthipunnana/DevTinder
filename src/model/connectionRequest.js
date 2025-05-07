const mongoose = require("mongoose")

const ConnectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    status:{
        type: String,
        required:true,
        enum:{
            values:["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is invalid status type`
        }

    }
}, {timestamps:true})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", ConnectionRequestSchema)

module.exports = {ConnectionRequestModel}