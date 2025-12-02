
const express = require('express');
const User = require('../Models/User.js');
const Profile = require('../Models/Profile.js');
const Connection = require('../Models/Connection.js');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Notification = require("../Models/Notification.js");


//





module.exports.register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !password || !username)
            return res.status(401).json({ message: "All fields are required" });

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
            profilePicture: ""   // <-- FIXED: use default pic instead of newUser.profilePicture
        });

        // Create token
        newUser.token = crypto.randomBytes(32).toString("hex");

        await newUser.save();

        // Create empty profile for user
        const profile = new Profile({ userId: newUser._id });
        await profile.save();

        return res.json({
            message: "Registered successfully!",
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
            token: newUser.token
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(401).json({ message: "all fields required" });

        const user = await User.findOne({
            email
        });

        if (!user) return res.status(400).json({ message: "user does not exists" });

        const ismatch = bcrypt.compare(password, user.password);
        if (!ismatch) return res.status(400).json({ message: "invalid credentials" });

        const token = crypto.randomBytes(32).toString("hex");
        // await User.updateOne({ _id: user._id }, { token });
        user.token = token;
        await user.save();
        return res.json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            token: user.token
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}


module.exports.uploadProfilePicture = async (req, res) => {


    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.replace("Bearer ", "").trim();

        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "user does not exists" });

        if (!req.file)
            return res.status(400).json({ message: "No image received" });

        // 4. Save uploaded file URL in DB
        user.profilePicture = req.file.path;
        await user.save();

        return res.status(200).json({
            message: "Profile picture updated!",
            profilePicture: user.profilePicture,
        });


    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.updateUserProfile = async (req, res) => {
    const { token, ...newUserdata } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(400).json({ message: "user does not exists" });

        const { username, email } = newUserdata;
        const existinguser = await User.findOne({ $or: [{ username, email }] });
        if (existinguser) {
            if (existinguser || String(existinguser._id != String(user._id))) {
                return res.status(400).json({ message: "user already exists" });
            }
        }

        Object.assign(user, newUserdata);
        await user.save();
        return res.json({ message: " user updated" });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports.getuserandprofile = async (req, res) => {
    try {


        console.log("AUTH HEADER:", req.headers.authorization);

        const authHeader = req.headers.authorization;

        let token = "";

        // Case 1 → token from Authorization header
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // Case 2 → token from body
        if (!token && req.body?.token) {
            token = req.body.token;
        }

        // Case 3 → token from query string
        if (!token && req.query?.token) {
            token = req.query.token;
        }

        console.log("EXTRACTED TOKEN:", token);

        if (!token) {
            return res.status(400).json({ message: "token required" });
        }



        const user = await User.findOne({ token: token.trim() });
        if (!user) return res.status(400).json({ message: "user does not exists" });

        const userprofile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name email username profilePicture");

        if (!userprofile) return res.status(401).json({ message: "profile not found" });

        return res.json(userprofile);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



module.exports.updateprofiledata = async (req, res) => {

    // const { token, ...newprofiledata } = req.body;

    try {
        //  const user = await User.findOne({ token: token.trim() });
        //  if (!user) return res.status(400).json({ message: "user does not exists" });

        //   const userprofile = await Profile.findOne({ userId: user._id })
        //  Object.assign(userprofile, newprofiledata);
        //  await userprofile.save();

        //  return res.json({ message: "updated successfully" });


        // STEP 1 — Extract token from headers
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.replace("Bearer ", "").trim();

        // STEP 2 — Find user using token
        const user = await User.findOne({ token });
        if (!user)
            return res.status(404).json({ message: "User does not exist" });

        // STEP 3 — Fetch user's profile
        const userprofile = await Profile.findOne({ userId: user._id });

        if (!userprofile)
            return res.status(404).json({ message: "Profile not found" });

        // STEP 4 — Update profile only with allowed fields
        const allowedFields = [
            "name",
            "title",
            "bio",
            "currentpost",
            "education",
            "pastwork"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                userprofile[field] = req.body[field];
            }
        });

        await userprofile.save();

        return res.json({ message: "updated successfully", updatedUser: userprofile });




    } catch (err) {
        return res.status(500).json({ message: err.message });
    }


};



module.exports.getallusers = async (req, res) => {

    try {
        const users = await User.find({}, "name username profilePicture")  // we use populate only when data is in another model
            .lean();

        return res.json(users);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}




module.exports.getalluserprofiledata = async (req, res) => {
    //for all users with same
    //  name etc like when searching 
    // we see all users with
    //  matching ddata that we 
    // inputed

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.replace("Bearer ", "").trim();

        // STEP 2 — Find user using token
        const user = await User.findOne({ token });
        if (!user)
            return res.status(404).json({ message: "User does not exist" });


        const userprofile = await Profile.findOne({ userId: user._id })

        return res.json(userprofile);



    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getprofile = async (req, res) => {
    try {
        const user_id = req.params.id
        const userprofile = await Profile.findOne({ userId: user_id })
            .populate("userId", "name email username profilePicture");
        if (!userprofile) return res.status(401).json({ message: "not found" });
        return res.json(userprofile);


    } catch (err) {
        return res.json({ message: message.err });
    }
};

module.exports.sendconnectionrequest = async (req, res) => {
    const { connectionId } = req.body;

    try {
        // STEP 1 — Read Authorization token
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.replace("Bearer ", "").trim();

        // STEP 2 — Find sender (user sending request)
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: "user does not exists" });
        }

        // STEP 3 — Find target user
        const connectionuser = await User.findById(connectionId);
        if (!connectionuser) {
            return res.status(400).json({ message: "connection user does not exists" });
        }

        // STEP 4 — Check if already connected / request already sent
        const existingconnection = await Connection.findOne({
            userId: user._id,
            connectionId: connectionuser._id,
        });

        if (existingconnection) {
            return res.status(400).json({ message: "connection already sent" });
        }

        // STEP 5 — Create connection request
        const request = new Connection({
            userId: user._id,
            connectionId: connectionuser._id,
            status_accepted: "pending",
        });

        await Notification.create({
            userId: connectionuser._id,    // ⭐ RECEIVER
            connectionId: user._id,        // ⭐ SENDER
            message: `${user.name} sent you a connection request`,
        });



        await request.save();

        return res.status(200).json({ message: "request sent" });  // FIXED

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.getallmyconnectionrequests = async (req, res) => {
    const token = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(400).json({ message: "user does not exists" });
        }

        const connections = await Connection.find({ userId: user._id })
            .populate("connectionId", "name useraname email");
        return res.json(connections);
    } catch (err) {
        return res.status(500).json({ message: err.message });

    }
};

module.exports.myconnections = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.replace("Bearer ", "").trim();

    const user = await User.findOne({ token });
    if (!user)
      return res.status(404).json({ message: "User does not exist" });

    // ⭐ FETCH ONLY ACCEPTED CONNECTIONS
    const connections = await Connection.find({
      status_accepted: "accepted",  
      $or: [
        { userId: user._id },
        { connectionId: user._id }
      ]
    })
      .populate("userId", "name username email profilePicture")
      .populate("connectionId", "name username email profilePicture");

    // ⭐ FIX DUPLICATION — ALWAYS RETURN THE OTHER PERSON
    const finalList = connections.map(conn => {
      if (String(conn.userId._id) === String(user._id)) {
        return conn.connectionId;  // show other person
      } else {
        return conn.userId;        // show other person
      }
    });

    return res.json({ connections: finalList });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


module.exports.checkconnectionstatus = async (req, res) => {
    try {
        const profileId = req.params.profileId;

        const token = req.headers.authorization?.replace("Bearer ", "");
        const user = await User.findOne({ token });

        if (!user) return res.status(401).json({ status: "none" });

        // Check if already accepted
        const connected = await Connection.findOne({
            $or: [
                { userId: user._id, connectionId: profileId, status_accepted: "accepted" },
                { userId: profileId, connectionId: user._id, status_accepted: "accepted" }
            ]
        });

        if (connected) return res.json({ status: "connected" });

        // Check if YOU sent a request
        const pendingOutgoing = await Connection.findOne({
            userId: user._id,
            connectionId: profileId,
            status_accepted: "pending"
        });

        if (pendingOutgoing) return res.json({ status: "pending", requestId: pendingOutgoing._id });

        // Check if THEY sent a request to YOU
        const pendingIncoming = await Connection.findOne({
            userId: profileId,
            connectionId: user._id,
            status_accepted: "pending"
        });

        if (pendingIncoming)
            return res.json({ status: "incoming", requestId: pendingIncoming._id });

        return res.json({ status: "none" });

    } catch (err) {
        res.status(500).json({ status: "none" });
    }
};

module.exports.acceptrequest = async (req, res) => {
  console.log("\n🔥 ACCEPT REQUEST API HIT");
  console.log("BODY =", req.body);
  console.log("HEADERS =", req.headers.authorization);

  const { requestId, action_type } = req.body;

  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();
    console.log("TOKEN =", token);

    if (!token) return res.status(401).json({ message: "No token provided" });

    const user = await User.findOne({ token });
    console.log("USER FOUND =", user ? user._id : "NULL");

    if (!user) return res.status(400).json({ message: "User not found" });

    const connection = await Connection.findById(requestId);
    console.log("CONNECTION FOUND =", connection);

    if (!connection)
      return res.status(400).json({ message: "Connection request not found" });

    if (String(connection.connectionId) !== String(user._id)) {
      console.log("❌ NOT ALLOWED — connection.connectionId != user._id");
      return res.status(403).json({ message: "Not allowed" });
    }

    // ⭐ STRING STATUS
    if (action_type === "accept") {
      connection.status_accepted = "accepted";
    } else if (action_type === "reject") {
      connection.status_accepted = "rejected";
    }

    await connection.save();

    console.log("✔ UPDATED SUCCESSFULLY");
    return res.json({ message: "Request updated", connection });

  } catch (err) {
    console.log("🔥 ERROR =", err.message);
    return res.status(500).json({ message: err.message });
  }
};


module.exports.getincomingrequests = async (req, res) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "").trim();
        const user = await User.findOne({ token });

        const requests = await Connection.find({
            connectionId: user._id,
            status_accepted: "pending"
        }).populate("userId", "name profilePicture");

        res.json({ requests });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getnotifications = async (req, res) => {
    try {
        console.log("\n---- NOTIFICATIONS API CALLED ----");

        console.log("Authorization Header:", req.headers.authorization);

        const auth = req.headers.authorization;
        if (!auth) {
            console.log("NO AUTH HEADER");
            return res.status(401).json({ message: "No token" });
        }

        const token = auth.replace("Bearer ", "").trim();
        console.log("TOKEN RECEIVED:", token);

        const user = await User.findOne({ token });
        console.log("USER FOUND:", user ? user._id : null);

        if (!user) {
            console.log("USER NOT FOUND");
            return res.status(401).json({ message: "Invalid user token" });
        }

        // ⭐⭐ FIXED — POPULATE ADDED ⭐⭐
        const notifications = await Notification.find({
            userId: user._id
        })
            .sort({ createdAt: -1 })
            .populate({
                path: "connectionId",
                model: "User",
                select: "name profilePicture"
            });

        console.log("NOTIFICATIONS WITH POPULATE:", notifications);

        res.json({ notifications });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};




module.exports.rejectrequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;

        await Connection.findByIdAndDelete(requestId);

        return res.json({ message: "Connection Rejected" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
