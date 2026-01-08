import React, { useContext, useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import SarvavyapiContext from '../context/sarvavyapi/SarvavyapiContext';
import LoggedUser from './PropertyFunction';

export default function AddProperties() {
  const host = process.env.REACT_APP_BACKEND_URL;
  const { addProperty } = useContext(SarvavyapiContext);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    type: 'sale',
    categories: 'resident',
    size: '',
    price: '',
    address: '',
    city: '',
    condition: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isOnlyNumber = (value) => /^[0-9]*$/.test(value);

  useEffect(() => {
    axios.get(`${host}/api/property/cities`)
      .then(res => {
        const options = res.data.map(city => ({
          value: city.name,
          label: city.name
        }));
        setCities(options);
      })
      .catch(err => console.error("Error fetching city data:", err));
  }, []);

  const handleCityChange = (option) => {
    setSelectedCity(option);
    setFormData({ ...formData, city: option ? option.value : '' });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newErrors = { ...errors };
    if (["size", "price"].includes(id)) {
      if (!isOnlyNumber(value)) newErrors[id] = "Only numbers allowed";
      else delete newErrors[id];
    }
    setErrors(newErrors);
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) {
      setSuccessMessage("Please fix validation errors");
      return;
    }

    if (!formData.image || !formData.name || !formData.size || !formData.price || !formData.address || !formData.city || !formData.condition) {
      setSuccessMessage("Please fill in all required fields");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      setLoading(true);
      const success = await addProperty(data);
      if (success) {
        setSuccessMessage("Property added successfully! Await admin approval.");
        setFormData({ image: null, name: '', type: 'sale', categories: 'resident', size: '',price:'', address: '', city: '', condition: '' });
        setSelectedCity(null);
        document.getElementById('image').value = '';
      } else {
        setSuccessMessage('Failed to add property. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSuccessMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {(sessionStorage.getItem('token') && !sessionStorage.getItem('adminToken')) ? <LoggedUser /> : <h2>Welcome to Sarvavyapi</h2>}

      <div className="shadow-lg p-4 bg-white rounded mt-4" style={{ maxWidth: "600px", margin: "auto" }}>
        <h2 className="text-center text-primary mb-4">Add New Property</h2>

        <form onSubmit={handleSubmit}>
          {/* IMAGE */}
          <div className="mb-3">
            <label className="form-label">Property Image<span style={{color:"red"}}>*</span></label>
            <input type="file" id="image" className="form-control" onChange={handleImageChange} />
          </div>

          {/* NAME */}
          <div className="mb-3">
            <label className="form-label">Property Title<span style={{color:"red"}}>*</span></label>
            <input type="text" id="name" className="form-control" value={formData.name} onChange={handleChange} />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label">Description<span style={{color:"red"}}>*</span></label>
            <input type="text" id="condition" className="form-control" value={formData.condition} onChange={handleChange} />
            {errors.condition && <small className="text-danger">{errors.condition}</small>}
          </div>

          {/* TYPE */}
          <div className="mb-3">
            <label className="form-label">Sale Type<span style={{color:"red"}}>*</span></label>
            <select id="type" className="form-select" value={formData.type} onChange={handleChange}>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* CATEGORY */}
          <div className="mb-3">
            <label className="form-label">Property Type<span style={{color:"red"}}>*</span></label>
            <select id="categories" className="form-select" value={formData.categories} onChange={handleChange}>
              <option value="resident">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* SIZE */}
          <div className="mb-3">
            <label className="form-label">Size (sq. ft.)<span style={{color:"red"}}>*</span></label>
            <input type="text" id="size" className="form-control" value={formData.size} onChange={handleChange} />
            {errors.size && <small className="text-danger">{errors.size}</small>}
          </div>

          {/* PRICE */}
          <div className="mb-3">
            <label className="form-label">Price<span style={{color:"red"}}>*</span></label>
            <input type="text" id="price" className="form-control" value={formData.price} onChange={handleChange} />
            {errors.price && <small className="text-danger">{errors.price}</small>}
          </div>

          {/* ADDRESS */}
          <div className="mb-3">
            <label className="form-label">Address<span style={{color:"red"}}>*</span></label>
            <textarea id="address" className="form-control" rows="3" value={formData.address} onChange={handleChange}></textarea>
          </div>

          {/* CITY */}
          <div className="mb-3">
            <Select
              options={cities}
              value={selectedCity}
              onChange={handleCityChange}
              placeholder="Select City"
              isSearchable
            />
          </div>

          <button disabled={loading} className="btn btn-dark w-100" style={{ backgroundColor: "#1A237E", fontSize: "1.1rem", padding: "10px" }}>
            {loading ? "Submitting..." : "Submit Property"}
          </button>

          {successMessage && <div className="text-center mt-3 text-success">{successMessage}</div>}
        </form>
      </div>
    </div>
  );
}
