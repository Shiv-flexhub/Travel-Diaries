const express = require("express")
const { getAllUsers, signUp, login, getUser } = require("../controllers/userController")

const userRouter = express.Router() 

userRouter.get("/", getAllUsers)

userRouter.post("/signup", signUp);

userRouter.post("/login", login);

userRouter.get("/:id", getUser);

module.exports = userRouter;