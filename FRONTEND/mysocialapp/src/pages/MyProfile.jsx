import React from 'react'
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const user = JSON.parse(localStorage.getItem("user") || null);
  const [profile, setProfile] = useState(null);
  const [Flash, setFlash] = useState({ message: "", status: "" });
  const fileinputref = useRef(null);
  console.log("LOCALSTORAGE USER:", JSON.parse(localStorage.getItem("user")));
  console.log("TOKEN:", user?.token);




  useEffect(() => {
    const fetchProfile = async () => {
      const token = user?.token;
      console.log(token);

      try {
        const res = await axios.get("https://social-5req.onrender.com/getuserprofile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setProfile(res.data);
        setFlash({ message: "fetched data", status: "success" })



      } catch (err) {
        console.log("error:", err);
        console.log("backend message:", err.response?.data);
        console.log("status:", err.response?.status);
        setFlash({ message: err.response?.data, status: "danger" })


      }
    }

    fetchProfile();
  }, []);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;


    const formData = new FormData();
    formData.append("profilePicture", file);


    const token = user?.token;
    try {
      const res = await axios.post("https://social-5req.onrender.com/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );
      const updatedURL = res.data.profilePicture;

      // update localStorage immediately
      const updatedUser = { ...user, profilePicture: updatedURL };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // update screen instantly without full reload
      setProfile({ ...profile, profilePicture: updatedURL });

      // OR use a light reload (optional)
      window.location.reload();
      setFlash({ message: "image uploaded ", status: "success" })

    } catch (err) {
      console.log("UPLOAD ERROR:", err.response?.data || err);
      setFlash({ message: "error in uploading ", status: "danger" })

    }
  };


  const opengallery = () => {
    fileinputref.current.click();
  }



  const posts = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
      likes: 230,
      time: "2 hrs ago",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      likes: 410,
      time: "5 hrs ago",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      likes: 155,
      time: "1 day ago",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1487412912498-0447578fcca8",
      likes: 98,
      time: "3 hrs ago",
    },
    {
      id: 5,
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      likes: 312,
      time: "1 hr ago",
    },
    {
      id: 6,
      img: "https://images.unsplash.com/photo-1415935701388-58a01402490d",
      likes: 500,
      time: "22 mins ago",
    },
  ];


  return (
    <>
      <div className="container py-4" style={{top:"80px"}}>

        {/* Profile Card */}
        <div
          className="card shadow-lg rounded-4 p-4 mb-4 border-0 profile-card"
          style={{
            background: "linear-gradient(135deg, #ffffff, #f5f0ff)",
            top:"80px"
          }}
        >
          <div className="text-center position-relative">

            {/* Profile Picture */}
            <div className="position-relative d-inline-block">
              <img
                src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="profile"
                className="rounded-circle shadow-lg border border-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />

              {/* Camera button */}
              <button
                className="btn btn-light shadow-sm rounded-circle position-absolute"
                style={{
                  bottom: "5px",
                  right: "5px",
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                }}
                onClick={opengallery}
              >
                <i className="fa-regular fa-camera" />
              </button>
              <input
                type='file'
                accept='image/*'
                ref={fileinputref}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

            </div>

            <h3 className="mt-3 fw-bold">{user.name}</h3>
            <p className="text-secondary px-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
              {profile?.title || "add title"}
            </p>


            <Link to="/myconnections"><button
              className="btn btn-outline-secondary px-4 rounded-pill mt-3 me-2"
            >
              <i className="fa-solid fa-users me-2" /> My Connections
            </button></Link>

            {/* Edit button */}
            <Link to={"/editprofile"}><button
              className="btn px-4 fw-bold rounded-pill mt-3"
              style={{
                background: "linear-gradient(135deg, #7b00ff, #c300ff)",
                color: "white",
                boxShadow: "0 4px 12px rgba(150, 0, 200, 0.3)",
              }}
            >
              <i className="fa-solid fa-pen-to-square me-2" /> Edit Profile
            </button></Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row text-center mt-4 mb-4 g-3">
          {[
            { label: "Posts", value: "120" },
            { label: "Followers", value: "4.3K" },
            { label: "Following", value: "980" }
          ].map((item, index) => (
            <div key={index} className="col-4">
              <div
                className="card p-3 rounded-4 border-2 shadow-md stat-card"
                style={{ transition: "0.3s", top:"80px" }}
              >
                <h4 className="fw-bold mb-0">{item.value}</h4>
                <p className="text-muted small">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About Section */}

        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0" style={{top:"80px"}}>
          <h5 className="fw-bold mb-2">About</h5>
          <p className="text-muted" style={{ lineHeight: "1.6" }}>
            {profile?.bio || "add bio"}
          </p>
        </div>

        {/*currentpost*/}
        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0" style={{top:"80px"}}>
          <h5 className="fw-bold mb-2">Current Position</h5>
          <p className="text-muted" style={{ lineHeight: "1.6" }}>
            {profile?.currentpost || "No current position added."}
          </p>
        </div>

        {/* Past Work Section */}
        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0" style={{top:"80px"}}>
          <h5 className="fw-bold mb-2">Past Work Experience</h5>

          {profile?.pastwork?.length > 0 ? (
            <ul className="text-muted" style={{ lineHeight: "1.7", paddingLeft: "1rem" }}>
              {profile.pastwork.map((job) => (
                <li key={job._id}>
                  <strong>{job.company}</strong> — {job.position}
                  <span className="text-muted"> ({job.years} )</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No past experience added.</p>
          )}
        </div>

        {/* Education Section */}
        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0" style={{top:"80px"}}>
          <h5 className="fw-bold mb-2">Education</h5>

          {profile?.education?.length > 0 ? (
            <ul className="text-muted" style={{ lineHeight: "1.7", paddingLeft: "1rem" }}>
              {profile.education.map((edu) => (
                <li key={edu._id}>
                  <strong>{edu.school}</strong> — {edu.degree}
                  {edu.fieldofstudy && <span>, {edu.fieldofstudy}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No education added.</p>
          )}
        </div>





        {/* Posts Grid */}
        <div className="card shadow-sm rounded-4 p-4 border-0" style={{top:"80px"}}>
          <h5 className="fw-bold mb-3">Your Posts</h5>

          <div className="row g-3">
            {posts.map((item) => (
              <div key={item.id} className="col-6 col-md-4">
                <div
                  className="card rounded-4 overflow-hidden border-0 post-card"
                  style={{ transition: "0.25s" }}
                >
                  <img
                    src={item.img}
                    alt="post"
                    className="w-100"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="p-2 d-flex justify-content-between align-items-center">
                    <span className="text-muted small">{item.time}</span>
                    <span className="text-danger fw-bold">
                      <i className="fas fa-heart me-1" /> {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extra Styles */}
      <style>{`
      .post-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.15);
      }
      .stat-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      }
      .profile-card {
        backdrop-filter: blur(5px);
      }
    `}</style>
    </>
  );


}

export default MyProfile
