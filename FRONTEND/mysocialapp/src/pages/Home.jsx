import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Addpost from './Addpost';
import axios from 'axios';
import './Home.css'
import Incrementlikes from './Incrementlikes';
import AddComment from './Addcomment';


const Home = () => {
  const user = JSON.parse(localStorage.getItem("user") || null);
  const [posts, setPosts] = useState([]);
  const [openPost, setOpenPost] = useState(null);
  const [profile , setProfile] = useState([]);
  const token = localStorage.getItem("cryptoToken");
  console.log(user);



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
      



      } catch (err) {
        console.log("error:", err);
        console.log("backend message:", err.response?.data);
        console.log("status:", err.response?.status);
  


      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("https://social-5req.onrender.com/post/getallposts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("post:", res.data.posts)
        setPosts(res.data.posts);  // Adjust based on your backend response
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);


  const deletepost = async (postId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const token = user?.token;


      const res = await axios.delete(
        "https://social-5req.onrender.com/post/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { postId }  // axios DELETE needs `data`
        }
      );

      setPosts(prev => prev.filter(p => p._id !== postId));

      alert("Post deleted successfully!");
    } catch (err) {
      console.log("Delete Error:", err);
      alert(err.response?.data?.message || "Delete failed");
    }



  };

  const increaseCommentCount = (postId) => {
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, comments: (p.comments || 0) + 1 }
          : p
      )
    );
  };

  const decreaseCommentCount = (postId) => {
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, comments: Math.max(0, (p.comments || 0) - 1) }
          : p
      )
    );
  };




  return (

   <div className="home-page-layout">

      <>
        <div className="container-fluid bg-light min-vh-100 p-3">
          <div className="row no-scroll-parent">

            {/* Left Sidebar */}
            <div className="col-lg-3 mb-3"  style={{
                  position: "sticky",
                }}>
              <div className="card shadow-sm p-3 rounded-4 bg-white">
                <div className="d-flex flex-column align-items-center text-center">
                  <Link to="/myprofile"><img
                    src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="profile"
                    className="rounded-circle mb-2"
                    width="80" height="80"
                  /></Link>

                  <h5 className="fw-bold">{user?.name}</h5>

                  <p className="text-muted">
                    {profile?.title}
                  </p>

                </div>
                <hr />
                <div className="d-flex justify-content-between px-2">
                  <span>Connections</span>
                  <span className="fw-bold">350</span>
                </div>
              
                <hr />
                <div className="d-flex flex-column">
                  
                  <Link to="/myprofile"><div className="d-flex align-items-center mb-2">
                    <i className='fas fa-user' size="lg" style={{ color: '#09dc0cff', marginRight: "4px", cursor: "pointer" }} />
                    <span style={{ cursor: "pointer", color: "black", textDecorationLine: "none" }}>My Profile</span>
                  </div></Link>
                 
                  <div className="d-flex align-items-center">
                    <Link to="/myconnections"><i className='fas fa-user-friends' style={{ color: '#d509feff', marginTop: "7px", marginRight: "6px", cursor: "pointer" }} /></Link>
                    <span style={{ cursor: "pointer" }}>My Connections</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Feed */}
            <div className="col-lg-6 mb-3">
              {/* Post creation card */}
              <div className="card shadow-sm p-3 mb-3 rounded-4 bg-white" >
                <Addpost />
              </div>

              {/* Posts */}
              {posts.map(post => (
                <div key={post._id} className="card shadow-sm mb-3 rounded-4 bg-white" >
                  <div className="d-flex align-items-center p-2 position-relative">
                    <Link to={`/profile/${post.userId._id}`}><img src={post.userId.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={post.userId.name} className="rounded-circle me-2" width="50" height="50" /></Link>
                    <div>
                      <h6 className="mb-0 fw-bold">{post.userId.name}</h6>
                      <small className="text-muted">{post.createdat}</small>
                    </div>

                    {String(user._id) === String(post.userId._id) && (
                      <button
                        onClick={() => deletepost(post._id)}
                        className="btn btn-link text-danger position-absolute"
                        style={{ right: "10px", top: "10px" }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}

                  </div>
                  <div className="px-3 pb-3">
                    <p>{post.body}</p>
                    {post.media && post.media !== "" && (
                      <img src={post.media} alt="post" style={{ maxHeight: "350px", width: "70%", borderRadius: "20px" }}
                      />
                    )}

                  </div>
                  <div className="d-flex justify-content-around text-muted p-2 border-top">
                    <span>
                      <i className="fas fa-heart me-1 text-danger"
                        onClick={() => Incrementlikes(post._id, posts, setPosts)}
                      />{post.likes} Likes
                    </span>

                    <span>
                      <i className="fas fa-comment me-1 text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setOpenPost(openPost === post._id ? null : post._id)
                        }
                      />{post.comments} {
                        (post.comments === 1) ? "Comment" : "Comments"}
                
                    </span>

                    <span>
                      <i className="fas fa-share-square me-1 text-success"
                      />Share
                    </span>

                  </div>

                  {openPost === post._id && (
                    <AddComment postId={post._id} increaseCommentCount={increaseCommentCount} decreaseCommentCount={decreaseCommentCount} />
                  )}
                </div>
              ))}

            </div>

            {/* Right Sidebar */}
            <div className="col-lg-3 mb-3">
            
              {/* Trending Topics */}
              <div className="card shadow-sm p-3 rounded-4 bg-white mt-3">
                <h6 className="fw-bold mb-3">Trending Topics</h6>
                <ul className="list-unstyled">
                  <li className='mb-2' style={{ cursor: "pointer" }}><i className="fab fa-linkedin-in" size="lg" style={{ color: "#0A66C2", cursor: "pointer", marginRight: "5px" }}></i>ReactJS</li>
                  <li className="mb-2" style={{ cursor: "pointer" }}><i className="fab fa-twitter" size="lg" style={{ color: "#11bde9ff", cursor: "pointer", marginRight: "4px" }} />'AI & ML</li>
                  <li className="mb-2" style={{ cursor: "pointer" }}> <i className='fab fa-facebook-f' size="lg" style={{ color: "#231eb7ff", cursor: "pointer", marginRight: "4px" }} />Remote Work</li>
                  <li className="mb-2" style={{ cursor: "pointer" }}><i className="fab fa-google" size="lg" style={{ color: "#DB4437", cursor: "pointer", marginRight: "5px" }} />Web Development</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    </div >

  )
}


export default Home
