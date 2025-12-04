import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


const Login = () => {

  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [flash, setFlash] = useState({ message: "", type: "" });


  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setFlash({ message: "Please fill all fields", type: "danger" });
      return;
    }


    setFlash({ message: "", type: "" });

    try {
      const response = await axios.post("https://social-5req.onrender.com/login", formData);

      // Backend should return { token: "crypto-token", user: {...}, message: "Login successful" }
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          profilePicture: response.data.profilePicture,
          token: response.data.token
        }));
      }


      setFlash({ message: response.data.message || "Login successful!", type: "success" });
      console.log("Login successful:", response.data.user);
      Navigate("/home")

    } catch (error) {
      setFlash({ message: error.response?.data?.message || "Login failed", type: "danger" });
      console.error(error);
      Navigate("/login")
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light p-2">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Welcome Back</h2>
          <p className="text-muted">Login to your account</p>
        </div>

        {/* Flash message */}
        {flash.message && (
          <div className={`alert alert-${flash.type} alert-dismissible fade show`} role="alert">
            {flash.message}
            <button type="button" className="btn-close" aria-label="Close" onClick={() => setFlash({ message: "", type: "" })}></button>
          </div>
        )}

        {/* Login Form using divs */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className='fa fa-user'></i>
            </span>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className='fas fa-lock'></i>
            </span>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="d-grid mb-3">
          <button
            className="btn btn-primary gradient-btn btn-lg rounded-3"
            onClick={handleSubmit}
          >
            Login
          </button>
        </div>

        <div className="text-center mt-3">
          <p className="text-muted">Or login with</p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-outline-danger rounded-circle p-3">
              <i className="fab fa-google" size="lg" color="#DB4437" />
            </button>
            <button className="btn btn-outline-primary rounded-circle p-3">
              <i className='fab fa-facebook-f' size="lg" color="#0d48bdff" />
            </button>
            <button className="btn btn-outline-info rounded-circle p-3">
              <i className="fab fa-linkedin-in" size="lg" color="#0A66C2" />
            </button>
          </div>
        </div>

        <div className="text-center mt-3">
          <p className="text-muted">
            Don't have an account? <a href="/signup" className="text-primary">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};



export default Login