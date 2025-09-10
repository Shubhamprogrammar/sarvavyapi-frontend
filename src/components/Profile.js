import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

function Profile() {
  const host = process.env.REACT_APP_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const refClose = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    email: '',
    contact: '',
    address: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${host}/api/auth/profile`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'auth-token': sessionStorage.getItem('token'),
          },
        });

        const data = await response.json();
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          contact: data.contact,
          address: data.address,
          image: data.photo ? `${data.photo}` : '',
        });
        setPreviewImage(data.photo ? `${data.photo}` : null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("address", formData.address);

    if (formData.image instanceof File) {
      formDataToSend.append("profileImage", formData.image); // Ensure correct field name
    }

    try {
      const response = await fetch(`${host}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "auth-token": sessionStorage.getItem("token"),
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedUser = await response.json(); // Get updated user data
        setUser(updatedUser); // Update state with new data
        setPreviewImage(`${updatedUser.photo}?t=${new Date().getTime()}`); // Force reload image
        alert("Profile updated successfully");
        refClose.current.click();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch Modal for Editing Profile
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Profile</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Profile Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                  {previewImage && <img src={previewImage} alt="Preview" className="img-thumbnail mt-2" style={{ width: "100px", height: "100px" }} />}
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" value={formData.email}  disabled />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact</label>
                  <input type="text" className="form-control" id="contact" value={formData.contact} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" id="address" value={formData.address} onChange={handleChange} rows="3" required></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Close</button>
              <button type="button" onClick={handleUpdate} className="btn btn-success">Update Profile</button>
            </div>
          </div>
        </div>
      </div>

      <section className="user-profile-section">
        {loading ? (
          <p>Loading user profile...</p>
        ) : user ? (
          <div className="user-profile-card">
            <div className="edit-button-container">
              <i
                className="far fa-edit edit-icon"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setPreviewImage(user?.photo ? `${user.photo}?t=${new Date().getTime()}` : null);
                  ref.current.click();
                }}
              ></i>
            </div>

            <div className="profile-header">
              <img
                src={user?.photo ? `${user.photo}?t=${new Date().getTime()}` : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="user-profile-image"
              />

              <h2 className="user-name">{user.name}</h2>
            </div>
            <div className="user-details">
              <div className="user-detail-row"><span>Email:</span><span>{user.email}</span></div>
              <div className="user-detail-row"><span>Phone:</span><span>{user.contact}</span></div>
              <div className="user-detail-row"><span>Address:</span><span>{user.address}</span></div>
            </div>
          </div>
        ) : (
          <p>Unable to fetch user profile. Please try again later.</p>
        )}
      </section>
    </>
  );
}

export default Profile;
