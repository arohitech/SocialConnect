import React from "react";
import './first.css'
import { Link } from "react-router-dom";

const Firstpage = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light p-3">
      <div className="row w-100">

        {/* Left Section */}
        <div className="col-lg-6 d-flex flex-column justify-content-center p-5">
          <h1 className="display-4 animated-heading fw-bold  mb-3">Connect With Friends Without Exaggeration</h1>
          <p className="lead text-muted mt-2 mb-4">
            Discover amazing opportunities, connect with professionals, and grow your career. Our platform helps you find the right connections and resources.
          </p>
          <div>
            <Link to="/login" ><button className="btn gradient-btn btn-lg mt-2 me-3" style={{backgroundColor: "#970dcdff", color:"white"}}>
                Get started
            </button></Link>
          
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center p-5">
          <img 
            src="/nasa-1lfI7wkGWZ4-unsplash.jpg" 
            alt="Illustration" 
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>

      </div>
    </div>
  );
};

export default Firstpage;
