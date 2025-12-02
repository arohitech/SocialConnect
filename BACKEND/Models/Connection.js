const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",   // references your User model
            required: true,
        },
        connectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",   // references your User model

        },
        status_accepted: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }



    });

const Connection = mongoose.model("Connection", ConnectionSchema);
module.exports = Connection;