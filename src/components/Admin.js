import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";

export default function Admin() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("adminToken") ? true : false);
    const [loginCredentials, setLoginCredentials] = useState({ username: "", passkey: "" });
    const [pendingProperties, setPendingProperties] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [newAdmin, setNewAdmin] = useState({ username: "", passkey: "" });
    const [activeSection, setActiveSection] = useState("adminList");

    useEffect(() => {
        if (isLoggedIn) {
            fetchPendingProperties();
            fetchAdmins();
            emailjs.init("xxC91L5Sp9oPOX7cY");
        }
    }, [isLoggedIn]);

    const approveServiceId = "service_g4yovqj";
    const approveTemplateId = "template_g2xhk0p";

    const cancelServiceId = "service_g4yovqj";
    const cancelTemplateId = "template_vioh5e5";

    // Fetch all pending properties
    const fetchPendingProperties = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/property/pending");
            setPendingProperties(response.data);
        } catch (error) {
            console.error("Error fetching pending properties:", error);
            setErrorMessage("Failed to load pending properties.");
        }
    };

    // Handle property approval
    const handleApprove = async (propertyId) => {
        try {
            const propertyResponse = await axios.get(`http://localhost:5000/api/property/getallpropertyapp?propertyId=${propertyId}`);
            const property = propertyResponse.data[0];

            if (!property.user) {
                console.error("User ID not found in property object:", property);
                setErrorMessage("User ID not found.");
                return;
            }

            const userResponse = await axios.get(`http://localhost:5000/api/auth/profileq?user=${property.user}`);
            const user = userResponse.data;

            if (!user.email || !user.name) {
                console.error("User email or name not found");
                return;
            }

            // Send email from approval service
            await emailjs.send(approveServiceId, approveTemplateId, {
                to_name: user.name,
                recipient: user.email,
                property_name: property.name,
            });

            const response = await axios.put(`http://localhost:5000/api/property/approveproperty/${propertyId}`);
            if (response.status === 200) {
                setPendingProperties((prev) => prev.filter(property => property._id !== propertyId));
                setErrorMessage(null);
            } else {
                setErrorMessage("Approval failed. Please try again.");
            }
        } catch (error) {
            console.error("Error approving property:", error);
            setErrorMessage(error.response?.data?.error || "Approval request failed.");
        }
    };

    // Handle cancel action
    const handleCancel = async (propertyId) => {
        try {
            const propertyResponse = await axios.get(`http://localhost:5000/api/property/getallpropertyapp?propertyId=${propertyId}`);
            const property = propertyResponse.data[0];

            if (!property.user) {
                console.error("User ID not found in property object:", property);
                setErrorMessage("User ID not found.");
                return;
            }

            const userResponse = await axios.get(`http://localhost:5000/api/auth/profileq?user=${property.user}`);
            const user = userResponse.data;

            if (!user.email || !user.name) {
                console.error("User email or name not found");
                return;
            }

            // Send email from cancellation service
            await emailjs.send(cancelServiceId, cancelTemplateId, {
                to_name: user.name,
                recipient: user.email,
                property_name: property.name,
            });

            setPendingProperties((prev) => prev.filter(property => property._id !== propertyId));
        } catch (error) {
            console.error("Error handling property cancellation:", error);
            setErrorMessage("Failed to cancel property and notify user.");
        }
    };
    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/admin/admin-login", loginCredentials,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            if (response.data.success) {
                localStorage.setItem("adminToken", response.data.token);
                setIsLoggedIn(true);
                window.location.reload();
                setErrorMessage(null);
            } else {
                setErrorMessage("Invalid username or passkey.");
            }
        } catch (error) {
            setErrorMessage("Login failed. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        window.location.reload();
        setIsLoggedIn(false);
    };

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            console.log("Token being sent:", token);
            if (!token) {
                setErrorMessage("Unauthorized. Please log in again.");
                return;
            }
            const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
            setErrorMessage("Failed to load admin list.");
        }
    };

    const handleAddAdmin = async () => {
        if (!newAdmin.username || !newAdmin.passkey) {
            setErrorMessage("Username and Passkey are required.");
            return;
        }

        try {
            console.log("Sending request to register admin:", newAdmin); // Debug log

            const response = await axios.post("http://localhost:5000/api/admin/register", {
                username: newAdmin.username,
                passkey: newAdmin.passkey,
            });

            console.log("Response from server:", response.data);

            if (response.data.success) {
                alert("Admin added successfully!");
                setNewAdmin({ username: "", passkey: "" });
                fetchAdmins();
            } else {
                setErrorMessage("Failed to add new admin.");
            }
        } catch (error) {
            console.error("Error adding admin:", error.response?.data || error.message);
            setErrorMessage(error.response?.data?.msg || "Failed to add new admin.");
        }
    };
    const handleRemoveAdmin = async (adminId, username) => {
        if (username.toLowerCase() === "shubham") {
            alert("Admin 'shubham' cannot be removed.");
            return;
        }

        if (!window.confirm(`Are you sure you want to remove admin ${username}?`)) return;

        try {
            const token = localStorage.getItem("adminToken");
            await axios.delete(`http://localhost:5000/api/admin/remove/${adminId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAdmins((prev) => prev.filter(admin => admin._id !== adminId));
            alert("Admin removed successfully.");
        } catch (error) {
            console.error("Error removing admin:", error.response?.data || error.message);
            setErrorMessage(error.response?.data?.msg || "Failed to remove admin.");
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow-lg" style={{ marginTop: "-300px", maxWidth: "700px" }}>
                    <h3 className="text-center mb-3">Admin Login</h3>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <label className="form-label fw-semibold">Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        className="form-control mb-3"
                        value={loginCredentials.username}
                        onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                    />
                    <label className="form-label fw-semibold">Passkey</label>
                    <input
                        type="password"
                        placeholder="Passkey"
                        className="form-control mb-3"
                        value={loginCredentials.passkey}
                        onChange={(e) => setLoginCredentials({ ...loginCredentials, passkey: e.target.value })}
                    />
                    <button className="btn w-100" style={{ backgroundColor: "#1a237e", color: "white", borderRadius: "8px", padding: "10px 0" }} onClick={handleLogin}>Login</button>
                </div>
            </div>
        );
    }
    return (
        <div className="container-fluid">
            <div className="row min-vh-100">
                <div className="col-md-3 text-dark p-4 d-flex flex-column align-items-start">
                    <h4 className="mb-4 text-center w-100">Admin Panel</h4>
                    <ul className="nav flex-column w-100">
                        <li className="nav-item mb-2">
                            <button className="btn btn-outline-dark w-100" style={{ backgroundColor: "#1a237e", color: "white" }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#4855e0"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#1a237e"}
                                onClick={() => setActiveSection("adminList")}>Admin List</button>
                        </li>
                        <li className="nav-item mb-2">
                            <button className="btn btn-outline-dark w-100" style={{ backgroundColor: "#1a237e", color: "white" }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#4855e0"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#1a237e"}
                                onClick={() => setActiveSection("addAdmin")}>Add Admin</button>
                        </li>
                        <li className="nav-item mb-2">
                            <button className="btn btn-outline-dark w-100" style={{ backgroundColor: "#1a237e", color: "white" }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#4855e0"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "#1a237e"}
                                onClick={() => setActiveSection("approveProperties")}>Approve Properties</button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-danger w-100"
                                style={{ backgroundColor: "#dc3545", color: "white" }}
                                onClick={handleLogout}>Logout</button>
                        </li>
                    </ul>
                </div>

                <div className="col-md-9 p-4">
                    {activeSection === "adminList" && (
                        <div style={{ minHeight: "60vh" }}>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                            <h3 className="mb-3 text-center">All Admins</h3>
                            <ul className="list-group">
                                {admins.map((admin) => (
                                    <li key={admin._id} className="list-group-item d-flex justify-content-between align-items-center">
                                        {admin.username}
                                        <button className="btn btn-danger btn-sm" onClick={() => handleRemoveAdmin(admin._id, admin.username)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeSection === "addAdmin" && (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                            <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "12px" }}>
                                <h3 className="mb-4 text-center">Add New Admin</h3>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Username</label>
                                    <input
                                        type="text"
                                        placeholder="Enter username"
                                        className="form-control mb-3"
                                        style={{ borderRadius: "8px" }}
                                        value={newAdmin.username}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                    />

                                    <label className="form-label fw-semibold">Passkey</label>
                                    <input
                                        type="password"
                                        placeholder="Enter passkey"
                                        className="form-control mb-3"
                                        style={{ borderRadius: "8px" }}
                                        value={newAdmin.passkey}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, passkey: e.target.value })}
                                    />

                                    <button
                                        className="btn w-100"
                                        style={{ backgroundColor: "#1a237e", color: "white", borderRadius: "8px", padding: "10px 0" }}
                                        onClick={handleAddAdmin}>
                                        Add Admin
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeSection === "approveProperties" && (
                        <>
                            <h3 className="mb-3">Pending Properties</h3>
                            {pendingProperties.length === 0 ? (
                                <p>No pending properties for approval.</p>
                            ) : (
                                <table className="table table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Image</th>
                                            <th>Property Name</th>
                                            <th>Description</th>
                                            <th>Type</th>
                                            <th>Categories</th>
                                            <th>Location</th>
                                            <th>City</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingProperties.map((property) => (
                                            <tr key={property._id}>
                                                <td>
                                                    <img
                                                        src={property.image}
                                                        alt={property.name}
                                                        className="img-fluid rounded"
                                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                    />
                                                </td>
                                                <td>{property.name}</td>
                                                <td>{property.condition}</td>
                                                <td>{property.type}</td>
                                                <td>{property.categories}</td>
                                                <td>{property.address}</td>
                                                <td>{property.city}</td>
                                                <td>
                                                    <button className="btn btn-success me-2" onClick={() => handleApprove(property._id)}>Approve</button>
                                                    <button className="btn btn-danger" onClick={() => handleCancel(property._id)}>Cancel</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>);
}
