import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';


const AllUsers = () => {

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/getallusers");
                setUsers(res.data); // res.data MUST be an array
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);


    return (
        <>
            <div className="container mt-4">
                <h3 className="mb-4 text-center">
                    <i className="fa-solid fa-users"></i> All Users
                </h3>

                <div className="row">
                    {users.map((user) => (
                        <div className="col-md-4 col-sm-6 mb-4" key={user._id}>
                            <div className="card shadow-sm p-3 d-flex align-items-center text-center box">

                                {/* Profile Picture */}
                                <img
                                    src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt="profile"
                                    className="rounded-circle mb-3"
                                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                />

                                {/* User Name */}
                                <h5 className="card-title mb-1">{user.name}</h5>

                                {/* Username */}
                                <p className="text-muted">@{user.username}</p>

                                {/* Icon Buttons */}
                                <div>
                                    <button className="btn btn-primary btn-sm me-2">
                                        <i className="fa-solid fa-user-plus"></i> Connect
                                    </button>
                                    <Link to={`/profile/${user._id}`}><button className="btn btn-outline-secondary btn-sm">
                                        <i className="fa-solid fa-eye"></i> View
                                    </button></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <style>
                {

                    `

                .box{
                   transition: transform 0.3s ease-in-out;
                }
                .box:hover{
                   transform: scale(0.9);
                }

                `
                }
            </style>
        </>
    );
};

export default AllUsers;
