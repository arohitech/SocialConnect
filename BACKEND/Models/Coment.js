const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // references your User model
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",   // references your User model
      required: true,
    },
    body: {
      type: String,
      required: true,
    }

  });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;