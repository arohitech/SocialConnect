import React from 'react'
import axios from 'axios'

const Incrementlikes = async(postId , posts , setPosts) => {
    const user = JSON.parse(localStorage.getItem("user") || null);
 try {
        const token = user?.token;

        const res = await axios.post(
            "http://localhost:5000/post/addlikes",
            { postId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // update UI instantly
        setPosts(
            posts.map((p) =>
                p._id === postId ? { ...p, likes: res.data.likes } : p
            )
        );

    } catch (err) {
        console.error("Error liking post:", err);
    }
}

export default Incrementlikes
