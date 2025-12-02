import React from 'react'
import { Link } from 'react-router-dom';
import './nav.css'
import { useState,useEffect } from 'react';


const Navbar = () => {
    const user = JSON.parse(localStorage.getItem("user") || null);
    const [notifyCount, setNotifyCount] = useState(0);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const token = user?.token;
                const res = await axios.get("http://localhost:5000/getnotifications", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setNotifyCount(res.data.notifications.length);
            } catch (err) { }
        };

        loadNotifications();
    }, []);

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-2"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: "1"
                }}>

                <div className="container-fluid">

                    {/* Brand Logo */}
                    <div id="logo" className="navbar-brand d-flex align-items-center gap-2">
                        <i id="logoicon" className="fas fa-bolt text-primary logoicon" style={{ fontSize: "28px" }}></i>
                        <span id="logotext" className="fw-bold fs-4 logotext">SocialConnect</span>
                    </div>

                    {/* Hamburger Button */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarContent"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible Content */}
                    <div className="collapse navbar-collapse" id="navbarContent">

                        {/* Center Navigation Icons */}
                        <div className="d-flex gap-3 pt-3">

                            <div className="text-center nav-item" style={{ cursor: "pointer" }}>
                                <Link to="/home"><i className="fas fa-compass fs-4" style={{ color: "black" }}></i></Link>
                                <div style={{ fontSize: "12px" }}>Explore</div>
                            </div>

                            <div className="text-center nav-item" style={{ cursor: "pointer" }}>
                                <Link to={"/getallusers"}><i className="fas fa-users fs-4" style={{ color: "black" }}></i></Link>
                                <div style={{ fontSize: "12px" }}>People</div>
                            </div>

                            <div className="text-center nav-item" style={{ cursor: "pointer" }}>
                                <Link to="/myposts"><i className="fas fa-feather-alt fs-4" style={{ color: "black" }}></i></Link>
                                <div style={{ fontSize: "12px" }}>Posts</div>
                            </div>

                            <div className="text-center nav-item" style={{ cursor: "pointer", color: "black" }}>
                                <Link to={"/myconnections"}><i className="fas fa-rocket fs-4" style={{ color: "black" }}></i></Link>
                                <div style={{ fontSize: "12px" }}>Connections</div>
                            </div>

                        </div>

                        {/* Right Side User Controls */}
                        <div className="d-flex align-items-center gap-3 ms-auto mt-3 mt-lg-0">

                            <h5 className="mb-0">Hey! {user.name}</h5>

                            <div style={{ position: "relative" }}>
                                <Link to="/notifications">
                                    <i className="fas fa-bell fs-4" style={{ cursor: "pointer", color: "black" }}></i>

                                    {notifyCount > 0 && (
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: "-5px",
                                                right: "-8px",
                                                background: "red",
                                                color: "white",
                                                borderRadius: "50%",
                                                padding: "2px 6px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            {notifyCount}
                                        </span>
                                    )}
                                </Link>
                            </div>


                            <i className="fas fa-envelope fs-4" style={{ cursor: "pointer" }}></i>

                            <div className="d-flex align-items-center" style={{ cursor: "pointer" }}>
                                <Link to="/myprofile">
                                    <img
                                        src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                        width="40"
                                        height="40"
                                        className="rounded-circle"
                                    />
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>
            </nav>
        </div>

    )
}

export default Navbar
