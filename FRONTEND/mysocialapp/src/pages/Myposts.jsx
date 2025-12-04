import React from 'react'
import { useEffect,useState } from 'react';
import axios from 'axios';

const Myposts = () => {
  const user = JSON.parse(localStorage.getItem("user") || null);
  const [mypost, setmypost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = user?.token;
      console.log(token);

      try {
        const res = await axios.get("https://social-5req.onrender.com/post/getmyposts", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        setmypost(res.data);



      } catch (err) {
        console.log("error:", err);
        console.log("backend message:", err.response?.data);
        console.log("status:", err.response?.status);
        


      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete("https://social-5req.onrender.com/post/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { postId },
      });

      // Remove from UI instantly
      setmypost((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };
  return (
    <div>
      <div className="container py-4">

        <div className="text-center mb-4">
          <h2 className="fw-bold">My Posts</h2>
          <p className="text-muted">All posts you have created</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : mypost.length === 0 ? (
          <div className="text-center mt-5">
            <h5 className="text-muted">You haven't posted anything yet.</h5>
          </div>
        ) : (
          mypost.map((post) => (
            <div
              key={post._id}
              className="card shadow-sm rounded-4 mb-4"
            >
              {/* Header */}
              <div className="d-flex align-items-center p-3 position-relative">
                <img
                  src={
                    user?.profilePicture ||
                    "https://social-5req.onrender.com/public/default_profilepic.jpg"
                  }
                  alt="profile"
                  className="rounded-circle me-3"
                  width="55"
                  height="55"
                />

              
                <div>
                </div>

                <button
                  className="btn text-danger position-absolute"
                  style={{ right: "15px" }}
                  onClick={() => deletePost(post._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              {/* Post Body */}
              <div className="px-3 pb-3">
                <p className="mb-2">{post.body}</p>

                {post.media && post.media !== "" && (
                  <img
                    src={post.media}
                    alt="post content"
                    className="img-fluid rounded-4"
                    style={{
                      maxHeight: "400px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                  />
                )}
              </div>

              {/* Footer */}
              <div className="d-flex justify-content-around text-muted p-2 border-top">
                <span>
                  <i className="fas fa-heart text-danger me-1"></i>
                  {post.likes} Likes
                </span>
                <span>
                  <i className="fas fa-comment text-primary me-1"></i>
                  {post.comments} Comments
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Myposts
