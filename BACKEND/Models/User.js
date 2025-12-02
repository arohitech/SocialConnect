const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,

        },

        email: {
            type: String,
            required: true,
            unique: true,

        },

        password: {
            type: String,
            required: true,

        },

        active: {
            type: Boolean,
            default: true,
        },

        profilePicture: {
            type: String,
            default: "",// You can set a default avatar URL if you want
        },
        token:{
            type: String,
            default: "",
        }
    });

const User = mongoose.model("User", UserSchema);
module.exports=  User;