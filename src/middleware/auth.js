const jwt = require("jsonwebtoken")
const {UserModel} = require("../model/user.js")
const userAuth = async (req, res, next) => {
    try {
        // read the cookies
        const cookies = req.cookies
        const { token } = cookies
        if (!token) {
            return res.status(401).send("Please Login")
        }
        // validate the token
        const decodedMessage = await jwt.verify(token, "devTinder@123")
        // get the user
        const { _id } = decodedMessage
        const user = await UserModel.findOne({_id})
        if(!user){
            throw new Error("User not found!")
        }
        req.user =user
        next()
    }catch(e){
        res.send("Error: "+ e.message)
    }
    
}

module.exports = {userAuth}