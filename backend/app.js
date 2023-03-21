const express = require("express")
const app = express()
const cors = require("cors")
const dotenv = require("dotenv");

dotenv.config({path:"./config/.env"})

const PORT = process.env.PORT || 8000;

const userRouter = require("./routers/userRoutes");
const postRouter = require("./routers/postRoutes");


//middleware
app.use(cors());
app.use(express.json())
app.use("/user", userRouter);
app.use("/posts",postRouter);


require("./database/connection");

app.listen(PORT,()=>{
    console.log(`Listening to the localhost port ${PORT}`)
})


module.exports = app;