const express = require('express');

const { register, login, uploadProfilePicture,
    updateUserProfile, getuserandprofile, updateprofiledata,
    getalluserprofiledata, getprofile,
    sendconnectionrequest, getallmyconnectionrequests, myconnections,
    acceptrequest , getallusers , getincomingrequests , getnotifications , rejectrequest ,checkconnectionstatus} = require('../Controllers/usercontroller.js');

const { upload } = require("../cloud.js");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const route = express.Router();



route.post("/upload", upload.single("profilePicture"), uploadProfilePicture);
route.post("/register", register);
route.post("/login", login);
route.post("/updateuserProfile", updateUserProfile);
route.get("/getnotifications",getnotifications);
route.get("/getuserprofile", getuserandprofile);
route.get("/getincomingrequests", getincomingrequests);
route.put("/updateprofiledata", updateprofiledata);
route.get("/getallusers", getallusers);
route.get("/getalluserprofile", getalluserprofiledata);
route.get("/getprofile/:id", getprofile);
route.post("/sendconnectionrequest", sendconnectionrequest);
route.get("/getallmyconnectionrequests", getallmyconnectionrequests);
route.get("/myconnections", myconnections);

route.get("/checkconnectionstatus/:profileId", checkconnectionstatus);
route.put("/acceptrequest", acceptrequest);
route.delete("/rejectrequest", rejectrequest);



module.exports = route;