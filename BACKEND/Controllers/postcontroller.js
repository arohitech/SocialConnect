const express = require('express');
const User = require('../Models/User.js');
const Post = require('../Models/Post.js');
const Profile = require('../Models/Profile.js');
const Connection = require('../Models/Connection.js');
const bcrypt = require("bcrypt");
const crypto = require("crypto");



module.exports.createPost = async (req, res) => {

    try {
        // 1. Read token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];

        // 2. Find the user
        const user = await User.findOne({ token });
        if (!user)
            return res.status(401).json({ message: "Invalid token" });

        // 3. Prepare media URL
        let mediaUrl = "";
        if (req.file) {
            mediaUrl = req.file.path;
        }

        // 4. Create post
        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: mediaUrl,
        });

        await post.save();

        return res.status(201).json({ message: "Post created", post });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


module.exports.getmyposts = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];

        // 2. Find the user
        const user = await User.findOne({ token });
        if (!user)
            return res.status(401).json({ message: "Invalid token" });

        const posts = await Post.find({ userId: user._id })
            .sort({ createdat: -1 });



        return res.json(posts);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.getallposts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "name username email profilePicture");
        return res.json({ posts });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

module.exports.deletePost = async (req, res) => {


    //post._id → the real ID in MongoDB
    //postId → variable you send from frontend
    //Mongoose functions (findById or findOne({_id: ...})) map it automatically.
    //The name postId is just for readability in your code; it does not need to match _id.

    try {
        const postId = req.body.postId;

        if (!postId) {
            return res.status(400).json({ message: "postId required" });
        }

        // TOKEN FROM HEADERS
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        const user = await User.findOne({ token });

        if (!user) return res.status(401).json({ message: "Invalid token" });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not allowed to delete this post" });
        }

        await Post.findByIdAndDelete(postId);

        res.json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};






module.exports.incrementLikes = async (req, res) => {
    const { postId } = req.body;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        post.likes++;
        await post.save();
        return res.status(200).json({ message: "like added", likes: post.likes });
    } catch (err) {

        return res.status(404).json({ message: err.message });
    }
};


