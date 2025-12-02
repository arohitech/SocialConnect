const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema(
    {
        school: {
            type: String,
            default: ""
        },
        degree: {
            type: String,
            default: ""
        },
        fieldofstudy: {
            type: String,
            default: ""
        }

    });




const WorkSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            default: ""
        },
        position: {
            type: String,
            default: ""
        },
        years: {
            type: String,
            default: ""
        }

    });



const ProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User"
        },
        bio: {
            type: String,
            default: ""
        },
        currentpost: {
            type: String,
            default: ""
        },
        title:{
         type : String,
         default:""
        },

        pastwork: {
            type: [WorkSchema],
            default: []
        },
        education: {
            type: [EducationSchema],
            default: []
        }
    });

const Profile = mongoose.model("Profile", ProfileSchema);
module.exports = Profile;