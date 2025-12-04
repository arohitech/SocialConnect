import React, { useState, useEffect } from "react";
import axios from "axios";

const AddComment = ({ postId, increaseCommentCount, decreaseCommentCount }) => {

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Fetch comments when component loads
    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await axios.get(
                `https://social-5req.onrender.com/comment/getpostcomments/${postId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments(res.data.comments);
        } catch (err) {
            console.log("Fetch comments error:", err);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await axios.post(
                "https://social-5req.onrender.com/comment/add",
                {
                    postId,
                    body: newComment
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments(prev => [...prev, res.data.comment]);
            setNewComment("");

            increaseCommentCount(postId);
        } catch (err) {
            console.log("Add comment error:", err);
        }
    };

    const deleteComment = async (commentId) => {


        try {
            const res = await axios.delete(
                "https://social-5req.onrender.com/comment/delete",
                {
                    data: { commentId },   // ✔ body here
                    headers: { Authorization: `Bearer ${token}` }  // ✔ headers here
                }
            );

            // Remove from UI
            setComments(prev => prev.filter(c => c._id !== commentId));

            // Update comment count in Home.jsx
            decreaseCommentCount(postId);

        } catch (error) {
            console.log("Delete comment error:", error);
        }
    }






return (
    <div
        className="card shadow-sm p-3 mt-2 rounded-4 bg-white"
        style={{
            maxHeight: "400px",
            overflowY: "auto"
        }}
    >
        <h6 className="fw-bold mb-3">Comments</h6>

        {comments.length === 0 && (
            <p className="text-muted">No comments yet</p>
        )}

        {comments.map(c => (
            <div key={c._id} className="d-flex mb-3">
                <img
                    src={
                        c.userId?.profilePicture ||
                        "http://localhost:5000/public/default_profilepic.jpg"
                    }
                    width="40"
                    height="40"
                    className="rounded-circle me-2"
                    alt=""
                />
                <div className="bg-light p-2 rounded-3 w-100">
                    <strong>{c.userId?.username}</strong>

                    <p className="mb-0">{c.body}</p>
                    {String(c.userId?._id) === String(user._id) && (
                        <i
                            className="fas fa-trash text-danger"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "10px",
                                cursor: "pointer"
                            }}
                            onClick={() => deleteComment(c._id, c.userId._id)}
                        ></i>
                    )}
                </div>
            </div>
        ))}

        <div className="d-flex mt-3">
            <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="form-control rounded-pill"
            />
            <button
                className="btn btn-primary rounded-pill ms-2"
                onClick={addComment}
            >
                <i className="fas fa-paper-plane"></i>
            </button>
        </div>
    </div>
);
}


export default AddComment;
