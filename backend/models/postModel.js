const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }
})

const Post = new mongoose.model("Post", postSchema);

module.exports = Post