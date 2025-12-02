import React from 'react'
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Profile = () => {
  const { id } = useParams();
  const [userprofile, setUserProfile] = useState(null);

  const [connectionStatus, setConnectionStatus] = useState("none");
  const [requestId, setRequestId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  console.log("TOKEN =", token);

  /** ⭐ UNIVERSAL FUNCTION — CHECK STATUS ANYTIME */
  const checkStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/checkconnectionstatus/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setConnectionStatus(res.data.status);
      setRequestId(res.data.requestId || null);
    } catch (err) {
      console.log(err);
    }
  };

  /** ⭐ LOAD PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/getprofile/${id}`);
        setUserProfile(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, [id]);

  /** ⭐ CHECK STATUS ON LOAD */
  useEffect(() => {
    if (token) checkStatus();
  }, [id, token]);

  /** ⭐ SEND REQUEST */
  const sendRequest = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/sendconnectionrequest",
        { connectionId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConnectionStatus("pending");
      checkStatus(); // 🔥 instantly refresh UI

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  /** ⭐ ACCEPT REQUEST */
  const acceptRequest = async () => {
    try {
      await axios.put(
        "http://localhost:5000/acceptrequest",
        {
          requestId: requestId,
          action_type: "accept"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      setConnectionStatus("connected");
      checkStatus();
    } catch (err) {
      console.log(err);
    }
  };


  /** ⭐ REJECT REQUEST */
  const rejectRequest = async () => {
    try {
      await axios.delete(
        "http://localhost:5000/rejectrequest",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            requestId: requestId,
            action_type: "reject"
          }
        }
      );

      setConnectionStatus("none");
      checkStatus();
    } catch (err) {
      console.log(err);
    }
  };

  /** ⭐ DUMMY POSTS (your original) */
  const posts = [
    { id: 1, img: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d", likes: 230, time: "2 hrs ago" },
    { id: 2, img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee", likes: 410, time: "5 hrs ago" },
    { id: 3, img: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e", likes: 155, time: "1 day ago" },
    { id: 4, img: "https://images.unsplash.com/photo-1487412912498-0447578fcca8", likes: 98, time: "3 hrs ago" },
    { id: 5, img: "https://images.unsplash.com/photo-1518770660439-4636190af475", likes: 312, time: "1 hr ago" },
    { id: 6, img: "https://images.unsplash.com/photo-1415935701388-58a01402490d", likes: 500, time: "22 mins ago" },
  ];

  return (
    <>
      <div className="container py-4">

        {/* Profile Card */}
        <div className="card shadow-lg rounded-4 p-4 mb-4 border-0 profile-card"
          style={{ background: "linear-gradient(135deg, #ffffff, #f5f0ff)" }}
        >
          <div className="text-center position-relative">

            {/* Profile Picture */}
            <img
              src={
                userprofile?.userId?.profilePicture ||
                "http://localhost:5000/public/default_profilepic.jpg"
              }
              alt="profile"
              className="rounded-circle shadow-lg border border-3"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />

            <h3 className="mt-3 fw-bold">{userprofile?.userId?.name}</h3>
            <p className="text-secondary mt-2">{userprofile?.title || "No title"}</p>

            
          

            {/* ⭐ BUTTON LOGIC */}
            {connectionStatus === "connected" ? (
              <button className="btn btn-success px-4 rounded-pill mt-3" disabled>
                ✓ Connected
              </button>
            ) : connectionStatus === "pending" ? (
              <button className="btn btn-secondary px-4 rounded-pill mt-3" disabled>
                Request Sent
              </button>
            ) : connectionStatus === "incoming" ? (
              <>
                <button className="btn btn-success px-4 rounded-pill mt-3 me-2" onClick={acceptRequest}>
                  Accept
                </button>
                <button className="btn btn-danger px-4 rounded-pill mt-3" onClick={rejectRequest}>
                  Reject
                </button>
              </>
            ) : (
              <button
                onClick={sendRequest}
                className="btn px-4 fw-bold rounded-pill mt-3"
                style={{
                  background: "linear-gradient(135deg, #7b00ff, #c300ff)",
                  color: "white"
                }}
              >
                <i className="fa-solid fa-user-plus me-2" /> Connect
              </button>
            )}

          </div>
        </div>

        {/* Stats Row */}
        <div className="row text-center mt-4 mb-4 g-3">
          {[{ label: "Posts", value: "120" }, { label: "Followers", value: "4.3K" }, { label: "Following", value: "980" }]
            .map((item, index) => (
              <div key={index} className="col-4">
                <div className="card p-3 rounded-4 border-2 shadow-md stat-card">
                  <h4 className="fw-bold mb-0">{item.value}</h4>
                  <p className="text-muted small">{item.label}</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* About */}
        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0">
          <h5 className="fw-bold mb-2">About</h5>
          <p className="text-muted">{userprofile?.bio || "Add bio"}</p>
        </div>

        {/* Current Position */}
        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0">
          <h5 className="fw-bold mb-2">Current Position</h5>
          <p className="text-muted">{userprofile?.currentpost || "No current position added."}</p>
        </div>

        {/* Past Work */}
        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0">
          <h5 className="fw-bold mb-2">Past Work Experience</h5>
          {userprofile?.pastwork?.length > 0 ? (
            <ul className="text-muted">
              {userprofile.pastwork.map((job) => (
                <li key={job._id}>
                  <strong>{job.company}</strong> — {job.position} ({job.years} years)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No past experience added.</p>
          )}
        </div>

        {/* Education */}
        <div className="card shadow-sm rounded-4 p-4 mt-4 mb-4 border-0">
          <h5 className="fw-bold mb-2">Education</h5>
          {userprofile?.education?.length > 0 ? (
            <ul className="text-muted">
              {userprofile.education.map((edu) => (
                <li key={edu._id}>
                  <strong>{edu.school}</strong> — {edu.degree} {edu.fieldofstudy && `, ${edu.fieldofstudy}`}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No education added.</p>
          )}
        </div>

        {/* Posts */}
        <div className="card shadow-sm rounded-4 p-4 border-0">
          <h5 className="fw-bold mb-3">Your Posts</h5>

          <div className="row g-3">
            {posts.map((item) => (
              <div key={item.id} className="col-6 col-md-4">
                <div className="card rounded-4 overflow-hidden border-0 post-card">
                  <img src={item.img} alt="post" className="w-100" style={{ height: "200px", objectFit: "cover" }} />
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
};

export default Profile;
