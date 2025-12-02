import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const [flash, setFlash] = useState({ message: "", type: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            setFlash({
                message: "Please fill all fields",
                type: "danger",
            });
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/register",
                formData
            );

            if (response.data.token) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        _id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        profilePicture: response.data.profilePicture,
                        token: response.data.token,
                    })
                );
            }


            setFlash({
                message: response.data.message || "Signup successful!",
                type: "success",
            });

            navigate("/home");
        } catch (error) {
            setFlash({
                message: error.response?.data?.message || "Signup failed",
                type: "danger",
            });

            navigate("/signup");
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <div
                className="card shadow-lg p-4 rounded-4"
                style={{ maxWidth: "450px", width: "100%" }}
            >
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark">Create Account</h2>
                    <p className="text-muted">Join us and start your journey</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <i className="fa fa-user" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <i className="fa fa-user" />
                            </span>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />

                        </div>
                    </div>



                    <div className="mb-3">
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <i className="fas fa-envelope" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="input-group">
                            <span className="input-group-text bg-primary text-white">
                                <i className="fas fa-lock"></i>
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
                        <button className="btn gradient-btn btn-lg text-white" type="submit">
                            Sign Up
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <p className="text-muted">Or sign up with</p>
                    <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-outline-danger rounded-circle p-3">
                            <i className="fab fa-google" />
                        </button>
                        <button className="btn btn-outline-primary rounded-circle p-3">
                            <i className="fab fa-facebook-f" />
                        </button>
                        <button className="btn btn-outline-info rounded-circle p-3">
                            <i className="fab fa-linkedin-in" />
                        </button>
                    </div>
                </div>

                <div className="text-center mt-3">
                    <p className="text-muted">
                        Already have an account?{" "}
                        <a href="/login" className="text-primary">
                            Login
                        </a>
                    </p>
                </div>
            </div >
        </div >
    );
};

export default Signup;
