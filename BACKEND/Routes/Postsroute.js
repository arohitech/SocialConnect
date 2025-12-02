const express = require('express');
const { createPost , getallposts , deletePost , incrementLikes , getmyposts} = require('../Controllers/postcontroller.js');
const { upload } = require("../cloud.js");
const route = express.Router();



route.post("/create",upload.single("media"), createPost);
route.get("/getallposts", getallposts);
route.delete("/delete", deletePost);
route.post("/addlikes", incrementLikes);
route.get("/getmyposts", getmyposts);


module.exports = route;