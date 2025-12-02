import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const Navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;


  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    education: [],
    pastwork: [],
  });

  const [flash, setFlash] = useState({ message: "", type: "" })
  const [loading, setLoading] = useState(true);

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = user?.token || localStorage.getItem("cryptoToken");

      try {
        const res = await axios.get("http://localhost:5000/getuserprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile({
          name: res.data.name || "",
          title: res.data.title || "",
          bio: res.data.bio || "",
          currentpost: res.data.currentpost || "",

          education: (res.data.education || []).map(item =>
            typeof item === "object"
              ? `${item.school || ""} | ${item.degree || ""} | ${item.fieldofstudy || ""}`
              : item
          ),

          // PASTWORK OBJECT → STRING WITH ALL FIELDS
          pastwork: (res.data.pastwork || []).map(item =>
            typeof item === "object"
              ? `${item.company || ""} | ${item.position || ""} | ${item.years || ""}years`
              : item
          ),
        });

        setLoading(false);
      } catch (err) {
        console.log("error:", err);
      }
    };

    fetchProfile();
  }, []);

  // Handle text fields
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Handle array fields
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    const arr = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    setProfile({
      ...profile,
      [name]: arr,
    });
  };

  const saveProfile = async () => {
    try {
      const token = user?.token;

      if (!token) {
        setFlash({ message: "Please fill all fields", type: "danger" });
        return;
      }


      const formattedEducation = profile.education.map((item) => {
        const [school, degree, fieldofstudy] = item
          .split("|")
          .map((i) => i.trim());
        return { school, degree, fieldofstudy };
      });


      const formattedPastwork = profile.pastwork.map((item) => {
        const [company, position, years] = item
          .split("|")
          .map((i) => i.trim());
        return { company, position, years };
      });


      await axios.put(
        "http://localhost:5000/updateprofiledata",
        {
          name: profile.name,
          title: profile.title,
          bio: profile.bio,
          currentpost: profile.currentpost,
          education: formattedEducation,
          pastwork: formattedPastwork,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFlash({ message: "Profile updated", type: "Success" });
      Navigate("/myprofile");
    } catch (err) {
      console.log("UPDATE ERROR:", err);
      setFlash({ message: "oops! profile not updated", type: "danger" });
      Navigate("/editprofile");
    }
  };


  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-pink"></div>
      </div>
    );

  return (
    <div
      className="container py-5"

    >
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-10 col-sm-12">

          <div
            className="shadow-lg rounded-5 p-0"
            style={{
              backdropFilter: "blur(14px)",
              background: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {/* HEADER */}
            <div
              className="text-white text-center py-4 rounded-top-5"
              style={{
                background:
                  "linear-gradient(135deg, #ff5ac4, #c879ff, #a35cff)",
              }}
            >
              <h3 className="fw-bold m-0">
                <i className="fa-solid fa-user-pen me-2"></i>Edit Profile
              </h3>
            </div>

            {/* BODY */}
            <div className="p-4 px-5">

              {/* NAME */}
              <label className="form-label fw-semibold text-dark">
                <i className="fa-solid fa-user me-2 text-purple"></i>Name
              </label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="form-control form-control-lg mb-3 rounded-4"
                placeholder="Enter your name"
                style={{ border: "1px solid #d9b3ff" }}
              />

              {/* TITLE */}
              <label className="form-label fw-semibold text-dark">
                <i className="fa-solid fa-briefcase me-2 text-purple"></i>Title
              </label>
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
                className="form-control form-control-lg mb-3 rounded-4"
                placeholder="e.g. Software Engineer"
                style={{ border: "1px solid #e5b3ff" }}
              />

              <label className="form-label fw-semibold text-dark">
                <i className="fa-solid fa-briefcase me-2 text-purple"></i>Current Post
              </label>
              <input
                type="text"
                name="currentpost"
                value={profile.currentpost}
                onChange={handleChange}
                className="form-control form-control-lg mb-3 rounded-4"
                placeholder="e.g. Software Engineer"
                style={{ border: "1px solid #e5b3ff" }}
              />

              {/* BIO */}
              <label className="form-label fw-semibold text-dark">
                <i className="fa-solid fa-align-left me-2 text-pink"></i>Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio}

                onChange={handleChange}
                rows="3"
                className="form-control mb-3 rounded-4"
                placeholder="Write something about yourself..."
                style={{ border: "1px solid #ffb3df" }}
              />

              {/* EDUCATION */}
              <label className="form-label fw-semibold text-dark">
                <i className="fa-solid fa-graduation-cap me-2 text-purple"></i>
                Education
              </label>
              <input
                type="text"
                name="education"
                value={profile.education.join(", ")}


                onChange={handleArrayChange}
                className="form-control form-control-lg mb-3 rounded-4"
                placeholder="school | fieldofstudy/degree | years"
                style={{ border: "1px solid #d4a2ff" }}
              />

              {/* PAST WORK */}
              <label className="form-label fw-semibold text-dark">
                <i className="fa-solid fa-building me-2 text-pink"></i>
                Past Work
              </label>
              <input
                type="text"
                name="pastwork"
                value={profile.pastwork.join(", ")}
                onChange={handleArrayChange}
                className="form-control form-control-lg mb-4 rounded-4"
                placeholder="company | role | years"
                style={{ border: "1px solid #f7a0d7" }}
              />

              {/* BUTTON */}
              <button
                onClick={saveProfile}
                className="btn w-100 py-3 rounded-4 fw-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #ff5ac4, #a35cff, #ff7ee0)",
                  color: "white",
                  fontSize: "1.2rem",
                }}
              >
                <i className="fa-solid fa-save me-2"></i>Save Changes
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditProfile;
