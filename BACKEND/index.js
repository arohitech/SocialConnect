
const mongoose = require('mongoose');
const express = require('express');
require("dotenv").config();
const cors = require("cors");
const Userroute = require('./Routes/Usersroute.js');
const Postroute = require('./Routes/Postsroute.js');
const Commentroute = require('./Routes/commentroute.js');
const path = require("path");
 // Load .env variables

const app = express();

// Middlewares
app.use(cors({
  origin:"*",
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"],
}));

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use('/uploads',express.static("uploads"));


app.use("/", Userroute);
app.use("/post", Postroute);
app.use("/comment", Commentroute);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Import routes here if needed
// import authRoutes from "./routes/auth.js";
// app.use("/api/auth", authRoutes);

// Server Listen
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
