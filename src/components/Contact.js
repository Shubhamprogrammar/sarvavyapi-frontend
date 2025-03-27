import React, { useState, useContext } from "react";
import SarvavyapiContext from "../context/sarvavyapi/SarvavyapiContext";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",  // Corrected field name from 'message' to 'feedback'
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { addFeedback } = useContext(SarvavyapiContext);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form inputs
  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    if (!formData.feedback.trim()) errors.feedback = "Feedback is required.";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      await addFeedback(formData.name, formData.email, formData.feedback);
      setSuccessMessage("Thank you for your feedback!!!");
      setErrorMessage("");
      setFormData({ name: "", email: "", feedback: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mt-3">
      <div className="text-center mb-4">
        <h1 className="display-4">Contact Us</h1>
        <p className="lead text-muted">
          Have questions? Reach out to us, and we’ll be happy to assist you.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 d-flex justify-content-center">
          <div className="card shadow border-0">
            <div className="card-body">
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="feedback" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="feedback"
                    name="feedback"
                    rows="5"
                    value={formData.feedback}
                    onChange={handleChange}
                    placeholder="Write your message here"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-center">
        <h2>Visit Our Office</h2>
        <p>
          Sarvavyapi - The Real Estate, <br />
          123 Real Estate Avenue, <br />
          Navi Mumbai, Maharashtra, 400701
        </p>
        <p>Email: mauryashubham@sarvavyapi.com | Phone: +91 8850093749</p>
      </div>
    </div>
  );
};

export default ContactUs;
