const express = require("express");
const { getAllPosts, createPost, getPost, updatePost, deletePost } = require("../controllers/postControllers");

const postRouter = express.Router();

postRouter.get("/", getAllPosts);

postRouter.post("/createPost", createPost);

postRouter.get("/:id",getPost);

postRouter.put("/:id", updatePost);


postRouter.delete("/:id", deletePost);


module.exports = postRouter;