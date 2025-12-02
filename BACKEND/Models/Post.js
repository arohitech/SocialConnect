const mongoose = require("mongoose");
const Comment = require("./Coment");

const PostSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",   // references your User model
            required: true,
        },

        body: {
            type: String,
            required: true,
        },


        likes: {
            type: Number,
            default: 0
        },

        comments: {
            type: Number,
            default: 0
        },

        createdat: {
            type: Date,
            default: Date.now
        },

        updatedat: {
            type: Date,
            default: Date.now
        },

        media: {
            type: String,
            default: ""
        },
        active: {
            type: Boolean,
            default: true
        },

    });

PostSchema.pre("findOneAndDelete", async function (next) {
    try {
        const postId = this.getQuery()["_id"];

        // Delete all comments where postId = deleted post ID
        await Comment.deleteMany({ postId });

        next();
    } catch (err) {
        next(err);
    }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;