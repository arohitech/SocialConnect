import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // ⭐ GET TOKEN FROM USER OBJECT
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await axios.get(
          "https://social-5req.onrender.com/getnotifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,  // ⭐ CORRECT TOKEN
            },
          }
        );

        setNotifications(res.data.notifications);
      } catch (err) {
        console.log("Error loading notifications", err);
      }
    };

    loadNotifications();
  }, []);

  return (
    <div className="container mt-5 pt-4">
      <h2 className="fw-bold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <div className="alert alert-info">No notifications yet.</div>
      ) : (
        notifications.map((note) => (
          <div
            key={note._id}
            className="card shadow-sm rounded-4 p-3 mb-3 border-0"
            style={{
              background: "linear-gradient(135deg, #ffffff, #f7f7ff)",
            }}
          >
            <div className="d-flex align-items-center">

           {/* SENDER IMAGE */}
              <Link to={`/profile/${note.connectionId?._id}`}><img
                src={
                  note.connectionId?.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="sender"
                className="rounded-circle me-3"
                width="45"
                height="45"
                style={{ objectFit: "cover" }}
              /></Link>

              <div>
                {/* MESSAGE */}
                <p className="mb-1 fw-semibold">{note.message}</p>
                {/* TIME */}
                <small className="text-muted">
                  {new Date(note.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
