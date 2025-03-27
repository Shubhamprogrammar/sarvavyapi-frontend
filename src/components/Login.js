import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem('token', json.authToken);
        localStorage.setItem('userId', json.userId);
        navigate('/');
        window.location.reload();
        setSuccess(true);
        setError('');

      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code", // Use authorization code flow
    onSuccess: async (tokenResponse) => {
      console.log("Google Token Response:", tokenResponse);

      try {
        const response = await fetch('http://localhost:5000/api/auth/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.code }), // Use `tokenResponse.code`
        });

        const json = await response.json();
        console.log("Backend Response:", json);

        if (json.success) {
          localStorage.setItem('token', json.authToken);
          localStorage.setItem('userId', json.userId);
          window.location.reload();
          navigate('/');
        } else {
          setError('Google login failed. Please try again.');
        }
      } catch (error) {
        console.error('Google login error:', error);
        setError('An error occurred during Google login.');
      }
    },
    onError: () => {
      console.error("Google login failed");
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div
        className="container mt-5 w-50 mx-auto shadow-lg"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2 className="text-center">Login Form</h2>

        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {success && <div className="alert alert-success" role="alert">Login successful!</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Change Password Link */}
          <div className="text-end mb-3">
            <Link to="/forgot-password" className="text-primary" style={{ textDecoration: "none" }}>
              Change Password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn btn-dark w-100"
            style={{
              backgroundColor: "#1A237E",
              border: "none",
              fontSize: "1.1rem",
              color: "white",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "blue")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1A237E")}
          >
            Login
          </button>
        </form>
        <div className="mt-2 text-center" style={{ fontSize: '1rem' }}>
          Not having an account? <Link to="/signup" style={{ color: "#155BC0", textDecoration: "none" }}>Register Here</Link>
        </div>
        <div
          className="d-flex align-items-center my-4"
          style={{ position: "relative", textAlign: "center" }}
        >
          <hr style={{ flex: 1, borderColor: "#212121" }} />
          <span
            style={{
              padding: "0 10px",
              background: "white",
              color: "#BDBDBD",
              fontWeight: "bold",
              position: "relative",
              zIndex: 1,
            }}
          >
            OR
          </span>
          <hr style={{ flex: 1, borderColor: "#212121" }} />
        </div>

        <div className="mt-3 text-center">
          <button
            type="button"
            className="btn w-100 mb-2"
            style={{
              backgroundColor: "#ffffff",
              color: "#4285F4",
              border: "2px solid #4285F4",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
            onClick={() => googleLogin()}
          >
            <FcGoogle size={22} /> Continue with Google
          </button>
        </div>


      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
