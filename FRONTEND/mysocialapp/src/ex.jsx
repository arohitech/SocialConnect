

import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Ex = () => {
    const Navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    //message: Used to display feedback from the server, like "Login successful" or error messages.
    //loading: Tracks if the login request is in progress, so you can disable the button and show "Logging in


    const [Message, setMessage] = useState({ message: "", type: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        console.log("Login Data:", formData);
        try {
            const response = await axios.post("http://localhost:5000/login", formData);
            setMessage({ message: response.data.message || "Login successful!", type: "success" });
            console.log("Login successful:", response.data);
            Navigate('/')

            // Save crypto token if backend returns one
            //response.data.token: Your crypto-based backend may return a token to authenticate the user.
            //localStorage.setItem Saves the token in the browser so the user stays logged in.


            if (response.data.token) {
                localStorage.setItem("cryptoToken", response.data.token);
            }
        } catch (err) {
            setMessage({ message: err.response?.data?.message || "Login failed", type: "failure" });
            console.error(err);
        } finally {
            setLoading(false);
        }
        return (
            <div>
                {Message.message && (
                    <div className={`alert alert-success alert-dismissible fade show`} role="alert">
                        {Message.message}  <button type="button" className="btn-close" aria-label="Close" onClick={() => setFlash({ message: "", type: "" })}></button>
                    </div>
                )}
      


            </div>
        )
    }
}

export default Ex
