import React, { useContext, useState, useEffect } from 'react';
import Select from 'react-select';
import { FaMapMarkerAlt } from "react-icons/fa";
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
    price:"",
    address: '',
    city: '',
    condition: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get(`${host}/api/property/cities`)
      .then(response => {
        const cityOptions = response.data.map(city => ({
          value: city.name,
          label: city.name
        }));
        setCities(cityOptions);
      })
      .catch(error => {
        console.error("Error fetching city data:", error);
      });
  }, []);

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    setFormData({ ...formData, city: selectedOption ? selectedOption.value : '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image || !formData.name || !formData.size || !formData.price || !formData.address || !formData.city || !formData.condition) {
      setSuccessMessage('Please fill in all required fields');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const success = await addProperty(data);
      if (success) {
        setSuccessMessage('Your property has been added successfully! It will be reviewed by our admin team within 24 hours.');
        setFormData({ image: null, name: '', type: 'sale', categories: 'resident', size: '',price:'', address: '', city: '', condition: '' });
        setSelectedCity(null);
        document.getElementById('image').value = '';
      } else {
        setSuccessMessage('Failed to add property. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSuccessMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      {((sessionStorage.getItem('token') && !sessionStorage.getItem('adminToken'))) ?
        <LoggedUser /> : (<h2>Welcome to Sarvavyapi - The Real Estate</h2>)
      }
      <div className="form-container shadow-lg p-4 rounded bg-white mt-4" style={{ maxWidth: '600px', margin: 'auto' }}>
        <h2 className="text-center mb-4 text-primary">Add New Property</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">Property Image<span style={{color:"red"}}>*</span></label>
            <input type="file" className="form-control" id="image" onChange={handleImageChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Property Title<span style={{color:"red"}}>*</span></label>
            <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} placeholder="Enter property title" />
          </div>
          <div className="mb-3">
            <label htmlFor="condition" className="form-label">Property Description<span style={{color:"red"}}>*</span></label>
            <input type="text" className="form-control" id="condition" value={formData.condition} onChange={handleChange} placeholder="Enter property description" />
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">Sale Type<span style={{color:"red"}}>*</span></label>
            <select className="form-select" id="type" value={formData.type} onChange={handleChange}>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="categories" className="form-label">Property Type<span style={{color:"red"}}>*</span></label>
            <select className="form-select" id="categories" value={formData.categories} onChange={handleChange}>
              <option value="resident">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="size" className="form-label">Property Size (in sq. ft.)<span style={{color:"red"}}>*</span></label>
            <input type="text" className="form-control" id="size" value={formData.size} onChange={handleChange} placeholder="Enter property size" />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price (per sq. ft.)<span style={{color:"red"}}>*</span></label>
            <input type="text" className="form-control" id="price" value={formData.price} onChange={handleChange} placeholder="Enter property size" />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address<span style={{color:"red"}}>*</span></label>
            <textarea className="form-control" id="address" rows="3" value={formData.address} onChange={handleChange} placeholder="Enter property address"></textarea>
          </div>
          <div className="mb-3 d-flex align-items-center">
            {/* <label htmlFor="city" className="form-label me-2">City<span style={{color:"red"}}>*</span></label> */}
            {/* <FaMapMarkerAlt className="me-2 text-primary" style={{ fontSize: '1.2rem' }} /> */}
            <Select
              className="flex-grow-1"
              options={cities}
              id="city"
              name='city'
              placeholder="Select City"
              value={selectedCity}
              onChange={handleCityChange}
              isSearchable
              styles={{ control: (base) => ({ ...base, width: "100%" }) }}
            />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-dark" style={{ backgroundColor: "#1A237E", fontSize: "1.1rem", padding: "10px" }}>
              Submit Property
            </button>
            {successMessage && <div className="mt-4 text-center text-success">{successMessage}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
