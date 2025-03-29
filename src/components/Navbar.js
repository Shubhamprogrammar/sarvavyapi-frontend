import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    setIsAdmin(!!adminToken);
    setIsMenuOpen(false);
  }, []);
  const toggleNavbar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle user logout 
  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  // Close menu when a link is clicked
  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Logo */}
        <div className="navbar-brand">
          <Link className="navbar-logo" to="/">
            <img src="/images/Real Estate Logo.png" alt="Real Estate Logo" />
          </Link>
          <h3 className="navbar-title">Sarvavyapi</h3>
        </div>

        <button className="navbar-toggler" onClick={toggleNavbar} aria-label="Toggle navigation" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Menu Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li>
              <Link to="/" onClick={handleNavLinkClick}>Home</Link>
            </li>
            <li>
              <Link to="/residential" onClick={handleNavLinkClick}>Residential</Link>
            </li>
            <li>
              <Link to="/commercial" onClick={handleNavLinkClick}>Commercial</Link>
            </li>
            <li>
              <Link to="/blog" onClick={handleNavLinkClick}>Blogs</Link>
            </li>
            <li>
              <Link to="/about" onClick={handleNavLinkClick}>About Us</Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleNavLinkClick}>Contact Us</Link>
            </li>
          </ul>

          {/* Hide buttons when adminToken is present */}
          {!isAdmin && (
            <div className="navbar-buttons">
              {!localStorage.getItem('token') ? (
                <div className="auth-buttons">
                  <Link className="nav-link" to="/login" onClick={handleNavLinkClick}>
                    <button className="btn" type="button">Login</button>
                  </Link>
                  <Link className="nav-link" to="/signup" onClick={handleNavLinkClick}>
                    <button className="btn" type="button">Signup</button>
                  </Link>
                </div>
              ) : (
                <button className="btn" onClick={handleLogOut} type="button">Logout</button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
