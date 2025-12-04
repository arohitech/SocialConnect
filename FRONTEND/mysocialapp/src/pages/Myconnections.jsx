

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



const Myconnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const token = user?.token;

        const res = await axios.get("https://social-5req.onrender.com/myconnections", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ⭐ STORE ONLY THE ARRAY
        setConnections(res.data.connections);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  return (
    <div className="container py-4" style={{ paddingTop: "100px" }}>
      <h2 className="text-center fw-bold mt-5">My Connections</h2>

      {/* Loader */}
      {loading && (
        <div className="d-flex justify-content-center mt-4">
          <div
            className="spinner-border text-success"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="row mt-3 g-4">
          {connections.length === 0 && (
            <h6 className="text-center text-muted">No connections yet</h6>
          )}

          {connections.map((conn) => (
            <div key={conn._id} className="col-sm-6 col-lg-3">
              <div
                className="card border-0 rounded-4 p-3 text-center small-card"
                style={{ transition: "0.25s", cursor: "pointer" }}
              >
                <Link to={`/profile/${conn._id}`}>
                  <img
                    src={conn.profilePicture || "https://via.placeholder.com/80"}
                    className="rounded-circle shadow-sm mb-3"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                </Link>

                <h6 className="fw-bold mb-1">{conn.name}</h6>
                <p className="text-muted small">@{conn.username}</p>

                <button className="btn btn-outline-success btn-sm rounded-pill px-3 mt-2">
                  <i className="fa-solid fa-user-check me-1"></i> Connected
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hover Effect */}
      <style>{`
        .small-card {
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .small-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 18px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};
export default Myconnections;