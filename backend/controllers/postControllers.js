const { default: mongoose } = require("mongoose");
const Post = require("../models/postModel")
const User = require("../models/userModel");


exports.getPost = async(req,res,next) => {
    const id = req.params.id;
    
    let post;
    
    try{
        post = await Post.findById(id)
    }catch(err){
        return console.log(err);
    }

    if(!post){
        return res.status(404).json({message:"post not available"})
    }

    return res.status(200).json({
        success:"true",
        post
    })
}

exports.getAllPosts = async(req,res,next)=>{

    let posts;
    try{
        posts = await Post.find().populate("user");
    }
    catch(err){
        return console.log(err);
    }
    

    if(posts.length===0){
        return res.status(404).json({
            message:"no posts available"
        })
    }

    if(!posts){
        return res.status(501).json({
            message:"unexpected error"
        })
    }

    return res.status(200).json({
        success:true,
        posts
    })
}

exports.createPost = async(req,res,next) => {
    const {title, description, location, image, user} = req.body;

    if(!title&&title.trim()===""&&
    !description&&description.trim()===""&&
    !location&&location.trim()===""&&
    !image&&image.trim()===""&&
    !user&&user.trim()===""){
        return res.status(422).json({
            message:"invalid data"
        })
    }
    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }

    if(!existingUser){
        return res.status(404).json({message:"user not found"})
    }

    let post;
    
    try{

        post = new Post({title, description, location, image, user});

        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.posts.push(post);
        await existingUser.save({session});
        await post.save({session});
        session.commitTransaction();

    }catch(err){
        return console.log(err);
    }
    
    if(!post){
        return res.status(500).json({message:"unexpected error occurred"});
    }

    return res.status(201).json({
        success:"true",
        post
    })
}

exports.updatePost = async(req,res,next) =>{
    const {title, description, location, image} = req.body;
    const id = req.params.id;

    if(!title&&title.trim()===""&&
    !description&&description.trim()===""&&
    !location&&location.trim()===""&&
    !image&&image.trim()===""){
        return res.status(422).json({
            message:"invalid data"
        })
    }

    let post;

    try{
        post = await Post.findByIdAndUpdate(id,{
            title,
            description,
            location,
            image
        })
    }catch(err){
        return console.log(err);
    }

    if(!post){
        return res.status(404).json({message:"post not available"})
    }

    return res.status(200).json({success:true,
        message:"data updated successfully"})

}

exports.deletePost = async(req,res,next) => {
    const id = req.params.id;

    let post;
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        post = await Post.findById(id).populate("user");
        post.user.posts.pull(post);
        await post.user.save({session});
        post = await Post.findByIdAndRemove(id);
        session.commitTransaction();
    }catch(err){
        return console.log(err);
    }

    if(!post){
        return res.status(404).json({message:"post not found"})
    }

    return res.status(200).json({
        success:"true",
        message:"post deleted successfully"
    })
}