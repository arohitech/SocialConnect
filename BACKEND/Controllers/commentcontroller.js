const express = require('express');
const User = require('../Models/User.js');
const Post = require('../Models/Post.js');
const Comment = require('../Models/Coment.js');



module.exports.addcomment = async (req, res) => {
    try {
        // 1. Read token from headers
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing or invalid" });
        }

        const token = authHeader.split(" ")[1]; // Extract the token

        // 2. Read other data from body
        const { postId, body } = req.body;

        if (!postId || !body) {
            return res.status(400).json({ message: "postId and body are required" });
        }

        // 3. Verify user using token
        const user = await User.findOne({ token });
        if (!user) return res.status(401).json({ message: "Invalid or expired token" });

        // 4. Check if post exists
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // 5. Create comment
        const newComment = await Comment.create({
            userId: user._id,
            postId: post._id,
            body
        });

        post.comments += 1;
        await post.save();

        res.json({
            message: "Comment added successfully",
            comment: newComment
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.deleteComment = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const { commentId } = req.body;
        if (!commentId) {
            return res.status(400).json({ message: "commentId required" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // ✔ Only author can delete their comment
        if (String(comment.userId) !== String(user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Get the post to reduce count
        const post = await Post.findById(comment.postId);

        await comment.deleteOne();

        if (post) {
            post.comments = Math.max(0, (post.comments || 0) - 1);
            await post.save();
        }

        res.json({ message: "Comment deleted successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports.getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return res.status(400).json({ message: "postId is required" });
        }

        // Fetch all comments for the post and populate user info
        const comments = await Comment.find({ postId })
            .populate("userId", "username profilePicture") // populate only username from user
            .sort({ createdAt: -1 }); // latest comment first

        res.json({ comments });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


