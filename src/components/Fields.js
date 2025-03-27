import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function Fields() {
    const [cities, setCities] = useState([]);  
    const [selectedCity, setSelectedCity] = useState(null);  
    const [propertyType, setPropertyType] = useState("resident");
    const [transactionType, setTransactionType] = useState("rent");

    const navigate = useNavigate(); // Used for navigation

    useEffect(() => {
        axios.get("http://localhost:5000/api/property/cities") 
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

    const handleSearch = () => {
        navigate(`/search?city=${selectedCity?.value || ''}&categories=${propertyType}&type=${transactionType}`);
    };

    return (
        <div 
            className="container mt-3 p-4 rounded"
            style={{
                backgroundImage: "url(/images/buildingforinp.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "400px",
                maxWidth: "1300px",
                margin: "0 auto"
            }}
        >
            <h3 className="text-center mb-4" style={{ color: '#fff' }}>
                Rent or Sale Apartments / Flats or Offices
            </h3>

            {/* Filters Row - Now in One Line */}
            <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                
                {/* Property Type */}
                <select 
                    className="form-select w-auto"
                    value={propertyType} 
                    onChange={(e) => setPropertyType(e.target.value)}
                    style={{ minWidth: "160px" }}
                >
                    <option value="resident">Residential</option>
                    <option value="commercial">Commercial</option>
                </select>

                {/* Rent or Sale */}
                <select 
                    className="form-select w-auto"
                    value={transactionType} 
                    onChange={(e) => setTransactionType(e.target.value)}
                    style={{ minWidth: "140px" }}
                >
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                </select>

                {/* City Selection - Fixed Width */}
                <div className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    <Select 
                        className="search-input"
                        options={cities}
                        placeholder="Select a City"
                        value={selectedCity}
                        onChange={setSelectedCity}
                        isSearchable
                        styles={{ 
                            control: (base) => ({
                                ...base, 
                                width: "250px"  // Fixed width for city dropdown
                            }) 
                        }}
                    />
                </div>

                {/* Search Button */}
                <button 
                    className="btn"
                    style={{
                        backgroundColor: '#1A237E',
                        color: 'white',
                        fontSize: '1rem',
                        padding: "8px 20px",
                        minWidth: "180px"
                    }}
                    onClick={handleSearch}
                >
                    <FaSearch className="me-2" /> Search Properties
                </button>
            </div>
        </div>
    );
}
