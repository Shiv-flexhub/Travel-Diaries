const { hashSync, compareSync } = require("bcryptjs");
const User = require ("../models/userModel")

//get all the user
exports.getAllUsers = async(req,res,next) =>{
    let users;
    try{
        users = await User.find();
    }catch(err){
        return console.log(err);
    }
    

    if(users.length==0){
        return res.status(500).json({
            success:false,
            message:"no user found"      
        });
    }

    if(!users){
        return res.status(500).json({message:"unknown error"})
    }

    return res.status(200).json({
        success:true,
        users      
    });
}

exports.getUser = async(req,res,next) =>{
    let user;
    let id = req.params.id;

    try{
        user = await User.findById(id).populate("posts");
    }catch(err){
        return console.log(err);
    }

    if(!user){
        return res.status(404).json({message:"user not found"})
    }

    return res.status(200).json({success:"true",
        message:"user found",
        user})
}

//register function
exports.signUp = async(req,res,next)=>{

    const { name, email, password } = req.body;

    if(!name && name.trim()==="" && !email && email.trim()==="" && !password && password.length()<6 ){
        res.status(422).json({
            message:"Invalid data" 
        })
    }

    const hashedPassword = hashSync(password)

    let user;
    try{
        user = new User({ email, name, password:hashedPassword });
        await user.save();
    }catch(err){
        console.log(err);
    }

    if(!user){
        res.status(500).json({
            message:"unexpected error"
        })
    }

    res.status(201).json({
        success:true,
        message:"user created",
        user
    })

   
}

//login function
exports.login = async(req,res,next)=>{
    const {email, password} = req.body;

    if(!email && email.trim()==="" && !password && password.length()<6 ){
        res.status(422).json({
            message:"Invalid credentials" 
        })
    }

    let existingUser;
    try{
        existingUser = await User.findOne({email})

    }catch(err){
        console.log(err);
    }

    if(!existingUser){
        return res.status(404).json({message:"no user found"});
    }

    const isPasswordCorrect = compareSync(password, existingUser.password);

    if(!isPasswordCorrect){
        return res.status(400).json({message:"invalid credentials"})
    }

    return res.status(200).json({success:true,
        message:"loged in!!",
        name: existingUser.name,
        id:existingUser._id
    })
}

