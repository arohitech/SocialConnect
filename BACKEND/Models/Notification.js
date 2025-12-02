
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
       required: true 
    },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },
  message: String,

  isRead: { type: Boolean, default: false },
  
}, { timestamps: true });   // ⭐ THIS CREATES createdAt & updatedAt



const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;