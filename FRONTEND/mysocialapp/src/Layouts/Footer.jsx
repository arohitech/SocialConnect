import React from 'react'

const Footer = () => {
    return (
        <div>
            <footer className="bg-dark text-white pt-5 pb-3 mt-5">
                <div className="container">

                    <div className="row">

                        {/* Brand + About */}
                        <div className="col-md-4 mb-4">
                            <h3 className="fw-bold d-flex align-items-center gap-2">
                                <i className="fas fa-bolt text-primary"></i> SocialConnect
                            </h3>
                            <p className="text-light mt-3">
                                Connect, share, and explore the world with SocialConnect — a modern
                                social platform built for everyone.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="col-md-2 mb-4">
                            <h5 className="fw-bold mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="/home" className="text-light text-decoration-none">Home</a></li>
                                <li className="mb-2"><a href="/myposts" className="text-light text-decoration-none">Posts</a></li>
                                <li className="mb-2"><a href="#" className="text-light text-decoration-none">People</a></li>
                                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Explore</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="col-md-2 mb-4">
                            <h5 className="fw-bold mb-3">Support</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Help Center</a></li>
                                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Privacy Policy</a></li>
                                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Terms & Conditions</a></li>
                                <li className="mb-2"><a href="#" className="text-light text-decoration-none">Contact Us</a></li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div className="col-md-4 mb-4">
                            <h5 className="fw-bold mb-3">Follow Us</h5>
                            <div className="d-flex gap-3 fs-4">
                                <i className="fab fa-instagram" style={{color:"#E1306C"}}></i>
                                <i className="fab fa-facebook" style={{color:"#1877F2"}}></i>
                                <i className="fab fa-twitter" style={{color:"#1DA1F2"}}></i>
                                <i className="fab fa-linkedin" style={{color:"#0A66C2"}}></i>
                                <i className="fab fa-youtube" style={{color:"red"}}></i>
                            </div>

                            <div className="mt-4">
                                <h6 className="fw-bold">Stay Updated</h6>
                                <div className="input-group mt-2">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                    />
                                    <button className="btn btn-primary">Subscribe</button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <hr className="border-secondary mt-4" />

                    {/* Bottom Section */}
                    <div className="text-center mt-3">
                        <p className="mb-0 text-light">
                            © {new Date().getFullYear()} SocialConnect — All Rights Reserved.
                        </p>
                    </div>

                </div>
            </footer>

        </div>
    )
}

export default Footer
