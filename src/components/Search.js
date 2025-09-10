import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SarvavyapiContext from '../context/sarvavyapi/SarvavyapiContext';
import axios from 'axios';

export default function Search() {
    const location = useLocation();
    const host = process.env.REACT_APP_BACKEND_URL;
    const [properties, setProperties] = useState([]);
    const { userContacts } = useContext(SarvavyapiContext);

    // Extract query parameters
    const queryParams = new URLSearchParams(location.search);
    const city = queryParams.get("city") || "";
    const categories = queryParams.get("categories") || "";
    const type = queryParams.get("type") || "";

    useEffect(() => {
        const formattedCity = city.replace(/%20/g, "+");
        axios.get(`${host}/api/property/getallpropertyt?city=${formattedCity}&categories=${categories}&type=${type}`)
            .then(response => {
                setProperties(response.data);
            })
            .catch(error => {
                console.error("Error fetching properties:", error);
            });
    }, [city, categories, type]);

    return (
        <div className="container py-3">
            <h2 className="mb-4 text-center">Properties</h2>
            {properties.length === 0 ? (
                <p className="text-center">No properties found</p>
            ) : (
                <div className="d-flex flex-column align-items-center gap-4">
                    {properties.map((property, index) => (
                        <div className="card w-100 shadow-sm" style={{ maxWidth: "600px" }} key={index}>
                            <img
                                src={property.image}
                                className="card-img-top"
                                alt={property.name}
                                style={{ height: "12rem", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                {/* Title and Icons on the Same Line */}
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <h5 className="card-title mb-0">{property.name}</h5>
                                </div>
                                {/* Two-column Layout */}
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <p className="card-text mb-1">Size: {property.size} sq.ft.</p>

                                        <p className="card-text mb-1">{property.address}, {property.city}</p>
                                    </div>
                                    <div className="text-end">
                                        {userContacts[property.user] && (
                                            <p className="card-text mb-2">Mobile: {userContacts[property.user]?.contact}</p>
                                        )}
                                        <p className="card-text mb-2">{property.condition}</p>

                                    </div>
                                </div>
                                <Link to={`/appointment/${property._id}`} className="btn btn-primary w-100">Book Appointment</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}