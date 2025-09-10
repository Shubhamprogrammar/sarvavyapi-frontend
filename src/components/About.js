import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h1 className="display-4">Sarvavyapi - The Real Estate</h1>
        <p className="lead text-muted">
          Redefining real estate with trust, transparency, and technology.
        </p>
      </div>

      <div className="row align-items-center">
        <div className="col-lg-6 text-center mb-4 mb-lg-0">
          <img
            src="/images/Real Estate.png"
            alt="Sarvavyapi Real Estate"
            className="img-fluid rounded shadow w-100"
            style={{ maxWidth: "90%" }}
          />
        </div>
        <div className="col-lg-6">
          <h2>Who We Are</h2>
          <p>
            Sarvavyapi - The Real Estate is a visionary company dedicated to
            revolutionizing the way people buy, sell, and invest in properties.
            With a strong commitment to transparency, trust, and advanced
            technology, we aim to make real estate transactions seamless and
            efficient for everyone.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to connect buyers and sellers, providing end-to-end
            solutions for all real estate needs. We are driven by a passion for
            delivering exceptional services and creating lasting relationships
            with our clients.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-center mb-4">Why Choose Us?</h2>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4 d-flex justify-content-center">
            <div className="card shadow border-0 h-100 w-100">
              <div className="card-body text-center">
                <h5 className="card-title">Transparency</h5>
                <p className="card-text">
                  We believe in honest and open communication to ensure our
                  clients make informed decisions.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4 d-flex justify-content-center">
            <div className="card shadow border-0 h-100 w-100">
              <div className="card-body text-center">
                <h5 className="card-title">Expert Guidance</h5>
                <p className="card-text">
                  Our team of experienced professionals guides you through
                  every step of the process.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4 d-flex justify-content-center">
            <div className="card shadow border-0 h-100 w-100">
              <div className="card-body text-center">
                <h5 className="card-title">Cutting-Edge Technology</h5>
                <p className="card-text">
                  Leveraging the latest technology to offer seamless and
                  efficient real estate solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-center mb-4">Our Values</h2>
        <ul className="list-group">
          <li className="list-group-item">Integrity in all our dealings</li>
          <li className="list-group-item">Client-first approach</li>
          <li className="list-group-item">Commitment to innovation</li>
          <li className="list-group-item">Sustainability and responsibility</li>
        </ul>
      </div>

      <div className="mt-5 text-center">
        <h2>Join Us on This Journey</h2>
        <p>
          Whether you are looking to buy your dream home, sell your property,
          or make a lucrative investment, Sarvavyapi is here to help. Explore
          the world of real estate with us.
        </p>
        <Link to='/contact'>
          <button className="btn btn-primary btn-lg mt-3">Contact Us</button>
        </Link>
      </div>
    </div>
  );
};

export default About;