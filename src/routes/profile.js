const express = require("express")
const bcrypt = require("bcrypt")
const profileRouter = express.Router()
const { userAuth } = require("../middleware/auth")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)
    }
    catch (e) {
        res.send("Error: " + e.message)
    }

})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    const ALLOWED_KEYS_TO_BE_UPDATED = ["gender", "bio", "age", "photoURL", "skills", "firstName", "lastName"]
    try {
        const isUpdateValid = Object.keys(req.body).every((k) => ALLOWED_KEYS_TO_BE_UPDATED.includes(k))
        if (!isUpdateValid) {
            throw new Error("Cannot update the user!")
        }
        const loggedInUser = req.user
        Object.keys(req.body).forEach(k => loggedInUser[k] = req.body[k])
        await loggedInUser.save()
        res.json({ data: loggedInUser, message: "User updated successfully!" })
    }
    catch (e) {
        res.send("Error: " + e.message)
    }

})


profileRouter.patch("/updatePassword", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Old and new passwords are required." });
        }

        const loggedInUser = req.user;

        const isPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Please enter a valid current password!" });
        }

        const isSamePassword = await bcrypt.compare(newPassword, loggedInUser.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "New password must be different from the old one." });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();

        res.json({ message: "Password has been updated successfully!" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});



module.exports = { profileRouter }