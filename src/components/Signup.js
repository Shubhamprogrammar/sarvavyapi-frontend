import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    profileImage: "",
    name: "",
    email: "",
    contact: "",
    address: "", 
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();
  const host = process.env.REACT_APP_BACKEND_URL;
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required.";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be 10 digits.";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required.";

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }

    if (formData.password !== formData.cpassword) {
      newErrors.cpassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("password", formData.password);
    if (formData.profileImage) {
      formDataToSend.append("photo", formData.profileImage);
    }

    try {
      setLoading(true);
      const response = await fetch(`${host}/api/auth/signup`, {
        method: "POST",
        body: formDataToSend,
      });

      const json = await response.json();

      if (json.success) {
        sessionStorage.setItem("token", json.authToken);
        sessionStorage.setItem("userId", json.userId);
        navigate("/");
        window.location.reload();
      } else {
        alert("Signup failed: " + (json.msg || "Invalid credentials"));
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-5 shadow-lg"
      style={{
        maxWidth: "800px",
        padding: "20px",
        borderRadius: "20px",
        backgroundColor: "white",
      }}
    >
      <h2 className="text-center mb-4">Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div
            className="text-center"
            style={{ width: "150px", height: "150px", flexShrink: "0" }}
          >
            <div
              className="rounded-circle"
              style={{
                width: "150px",
                height: "150px",
                border: "3px solid #007bff",
                backgroundColor: "#f0f0f0",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "#007bff" }}>No Image</span>
              )}
            </div>
          </div>

          <div style={{ flex: "1", marginLeft: "20px" }}>
            <label htmlFor="profileImage" className="form-label">
              Upload Profile Image<span style={{color:"red"}}>*</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        </div>

        {[
          { label: "Name", name: "name" },
          { label: "Email", name: "email", type: "email" },
          { label: "Contact", name: "contact" },
          {
            label: (
              <>
                Office Address{" "}
                <small className="text-muted">
                  (This address will be used for booking Appointment)
                </small>
              </>
            ),
            name: "address",
            type: "textarea",
          },
          { label: "Password", name: "password", type: "password" },
          { label: "Confirm Password", name: "cpassword", type: "password" },
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-3">
            <label htmlFor={name} className="form-label">
              {label}<span style={{color:"red"}}>*</span>
            </label>
            {type === "textarea" ? (
              <textarea
                className="form-control"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                rows="3"
                required
              />
            ) : (
              <input
                type={type || "text"}
                className="form-control"
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
              />
            )}
            {errors[name] && (
              <div className="text-danger" style={{ fontSize: "0.875rem" }}>
                {errors[name]}
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="btn w-100"
          disabled={loading}
          style={{ backgroundColor: "#1A237E", color: "white" }}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
