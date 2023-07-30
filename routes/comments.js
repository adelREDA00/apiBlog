const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const {verifyAdmin,verifyUser,verifyToken} = require("../utils/verifytoken");
const mongoose = require("mongoose");


// POST /posts/:postId/comments
router.post("/:postId/comments", verifyToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, userId } = req.body;

    // Create a new comment
    const newComment = new Comment({
      content,
      post: postId,
      user: userId,
    });

    // Save the comment
    const savedComment = await newComment.save();

    // Populate the user field in the comment with the corresponding user data
    const populatedComment = await Comment.populate(savedComment, { path: "user" });

    // Add the comment reference to the corresponding post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: savedComment._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Comment created successfully",
      comment: populatedComment, // Use the populatedComment instead of savedComment
      post: updatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create comment" });
  }
});
  
  // PUT /posts/:postId/comments/:commentId
  router.put("/", async (req, res) => {
    try {
      
      const { userId, postId, commentId ,content} = req.body.data;
      console.log(userId, postId, commentId ,content);
       // Find the comment and check if the user is the owner
    console.log(userId, postId, commentId);
    const comment = await Comment.findOne({
      _id: commentId,
      post: postId,
      user: userId,
    });
    if (!comment) {
      return res.status(401).json({ message: "Unauthorized access to comment" });
    }
  
      // Find the comment and update its content
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
      );
  
      res.json({
        message: "Comment updated successfully",
        comment: updatedComment,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update comment" });
    }
  });
  
// DELETE /posts/comments
// DELETE /posts/comments
router.delete("/",verifyToken, async (req, res) => {
  try {
    const { userId, postId, commentId } = req.body;
    

    // Find the comment and check if the user is the owner

    const comment = await Comment.findOne({
      _id: commentId,
      post: postId,
      user: userId,
    });
    if (!comment) {
      return res.status(401).json({ message: "Unauthorized access to comment" });
    }

    // Delete the comment
    await Comment.findByIdAndRemove(commentId);

    // Remove the comment reference from the corresponding post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    res.json({
      message: "Comment deleted successfully",
      post: updatedPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete comment", error: err.message });
  }
});




  // GET /comments
  router.get("/comments", async (req, res) => {
    try {
      
      const { commentIds } = req.query;
  
      // Convert the array of string IDs to an array of ObjectId values
      const convertedCommentIds = commentIds.map((id) => mongoose.Types.ObjectId(id));
  
      // Find the comments by their IDs
      const comments = await Comment.find({ _id: { $in: convertedCommentIds } }).populate("user");
  
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get comments" });
    }
  });
  



  
  
  module.exports = router;
