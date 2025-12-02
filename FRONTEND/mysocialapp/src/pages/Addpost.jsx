import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const Addpost = () => {
    const user = JSON.parse(localStorage.getItem("user") || null);

    const [formData, setFormData] = useState({
        body: "",
        media: null,
    });

    const [file, setFile] = useState(null);

    const handleTextChange = (e) => {
        setFormData({ ...formData, body: e.target.value });
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setFormData({ ...formData, media: selected });
    };


    const handleSubmit = async () => {
        try {
            const token = user?.token; // as you requested

            const fd = new FormData();
            fd.append("body", formData.body);

            if (formData.media) {
                fd.append("media", formData.media);
            }

            const res = await axios.post(
                "http://localhost:5000/post/create",
                fd,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Post created:", res.data);
            alert("Post created successfully!");

            // 🔥 RESET INPUTS
            setFormData({
                body: "",
                media: null,
            });

            setFile(null);

            // Clear file input manually
            document.getElementById("file-upload").value = "";

        } catch (err) {
            console.error(err);
            alert("Error creating post");
        }
    };


    return (
        <div className="card shadow-sm p-3 mb-3 rounded-4 bg-white">

            <div className="d-flex align-items-center mb-3">
                <Link to={"/myprofile"}>
                    <img
                        src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        className="rounded-circle me-2"
                        width="50"
                        height="50"
                    />
                </Link>

                <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Start a post"
                    value={formData.body}
                    onChange={handleTextChange}
                />
            </div>

            <label htmlFor="file-upload" className="btn btn-outline-primary rounded-pill">
                <i className="fas fa-image"></i> Add Image
            </label>

            <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {file && (
                <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="img-fluid rounded-3 mt-2"
                />
            )}

            <button
                onClick={handleSubmit}
                style={{
                    width: "100%", border: "none", marginTop: "20px",
                    padding: "7px", backgroundColor: "#ff4a92",
                    color: "white", borderRadius: "20px",
                }}
            >
                <i className="fas fa-paper-plane me-1" />Post
            </button>
        </div>
    );
};



export default Addpost
