import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope, FaPhone } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-dark text-white py-3">
            <div className="container">
                
                
                <div className="row mt-1">
                    {/* Company Info */}
                    <div className="col-md-4 mb-4">
                        <h5>Sarvavyapi - The Real Estate</h5>
                        <p>
                            Your trusted partner for finding the best real estate deals. We bring you premium properties tailored to your needs.
                        </p>
                    </div>
                    

                    {/* Quick Links */}
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
                            <li><Link to="/blog" className="text-white text-decoration-none">Blog</Link></li>
                            <li><Link to="/residential" className="text-white text-decoration-none">Residential Properties</Link></li>
                            <li><Link to="/commercial" className="text-white text-decoration-none">Commercial Properties</Link></li>
                            <li><Link to="/contact" className="text-white text-decoration-none">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="col-md-4">
                        <h5>Contact Us</h5>
                        <p>
                            <FaPhone />  +91 88500 93749<br />
                            <FaEnvelope /> mauryashubham@sarvavyapi.com
                        </p>
                        <p>
                            <strong>Address:</strong><br />
                            Sarvavyapi - The Real Estate, <br />
                            123 Real Estate Avenue, <br />
                            Navi Mumbai, Maharashtra, 400701
                        </p>
                    </div>
                </div>
                {/* Follow Us */}
                <div className="text-center">
                    <h4>Follow Us</h4>
                    <div className="d-flex justify-content-center gap-3">
                        <a href="https://facebook.com" className="text-white" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF size={30} />
                        </a>
                        <a href="https://x.com" className="text-white" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={30} />
                        </a>
                        <a href="https://www.linkedin.com/in/shubham-maurya-9932a3268/" className="text-white" target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn size={30} />
                        </a>
                    </div>
                </div>

                <hr className="border-light" />

                {/* Footer Bottom */}
                <div className="text-center">
                    <p className='mb-0'>
                        © 2025 Sarvavyapi - The Real Estate. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
