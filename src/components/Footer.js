import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-dark text-white py-4">
            <div className="container">
                <div className="row">
                    {/* Company Info */}
                    <div className="col-md-4 mb-3">
                        <h5>Sarvavyapi - The Real Estate</h5>
                        <p>
                            Your trusted partner for finding the best real estate deals. We bring you premium properties tailored to your needs.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-md-4 mb-3">
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
                    <div className="col-md-4 mb-3">
                        <h5>Contact Us</h5>
                        <p>
                            <strong>Phone:</strong> +91 88500 93749<br />
                            <strong>Email:</strong> mauryashubham@sarvavyapi.com
                        </p>
                        <p>
                            <strong>Address:</strong> <br />

                            <p>
                                Sarvavyapi - The Real Estate, <br />
                                123 Real Estate Avenue, <br />
                                Navi Mumbai, Maharashtra, 400701
                            </p>
                        </p>
                    </div>
                </div>

                <hr className="border-light" />

                {/* Footer Bottom */}
                <div className="text-center">
                    <p className="mb-0">
                        © {new Date().getFullYear()} Sarvavyapi - The Real Estate. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
