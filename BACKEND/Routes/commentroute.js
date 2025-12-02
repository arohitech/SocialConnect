const express = require('express');
const { addcomment , deleteComment , getCommentsByPost } = require('../Controllers/commentcontroller.js');
const route = express.Router();



route.post("/add", addcomment);
route.delete("/delete", deleteComment);
route.get("/getpostcomments/:id", getCommentsByPost );
module.exports = route;