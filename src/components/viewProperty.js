import React, { useContext, useEffect, useRef, useState } from 'react';
import SarvavyapiContext from '../context/sarvavyapi/SarvavyapiContext';

export default function ViewProperty() {
    const { properties, viewProperties, updateProperty, deleteProperty } = useContext(SarvavyapiContext);
    const ref = useRef(null);
    const refClose = useRef(null);

    const [selectedProperty, setSelectedProperty] = useState(null);
    const [formData, setFormData] = useState({
        image: '',
        name: '',
        type: '',
        categories: '',
        size: '',
        address: '',
        city: '',
        condition: ''
    });

    useEffect(() => {
        viewProperties();
        // eslint-disable-next-line
    }, []);

    const handleEditClick = (property) => {
        setFormData({
            image: property.image,
            name: property.name,
            type: property.type,
            categories: property.categories,
            size: property.size,
            address: property.address,
            city: property.city,
            condition: property.condition
        });
        setSelectedProperty(property);
        ref.current.click();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleUpdate = async () => {
        if (!selectedProperty) return;

        const success = await updateProperty(selectedProperty._id, formData);
        if (success) {
            alert("Property updated successfully!");
            refClose.current.click();
        } else {
            alert("Failed to update property");
        }
    };

    return (
        <>
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch Modal for Editing Properties
            </button>

            {/* Modal for editing properties */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Property</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className='my-3'>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Property Title</label>
                                    <input type="text" className="form-control" id="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="condition" className="form-label">Property Description</label>
                                    <input type="text" className="form-control" id="condition" value={formData.condition} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type" className="form-label">Sale Type</label>
                                    <select className="form-select" id="type" value={formData.type} onChange={handleChange}>
                                        <option value="sale">Sale</option>
                                        <option value="rent">Rent</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="categories" className="form-label">Property Type</label>
                                    <select className="form-select" id="categories" value={formData.categories} onChange={handleChange}>
                                        <option value="resident">Residential</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="size" className="form-label">Property Size</label>
                                    <input type="text" className="form-control" id="size" value={formData.size} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea className="form-control" id="address" rows="3" value={formData.address} onChange={handleChange}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <input type="text" className="form-control" id="city" value={formData.city} onChange={handleChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refClose}>Close</button>
                            <button type="button" onClick={handleUpdate} className="btn btn-success">Update Property</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Property Cards */}
            <div className="container py-3">
                <h2 className="mb-4 text-center">Your Properties</h2>
                {Array.isArray(properties) && properties.length === 0 ? (
                    <div className="alert alert-dark text-center">No properties to show</div>
                ) : (
                    <div className="d-flex flex-column align-items-center gap-4">
                        {properties.map((card, index) => (
                            <div className="card w-100 shadow-sm" style={{ maxWidth: "600px" }} key={index}>
                                <img
                                    src={card.image}
                                    className="card-img-top"
                                    alt={card.name}
                                    style={{ height: "12rem", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title mb-0">{card.name}</h5>
                                        <div>
                                        <i className="far fa-trash-alt mx-2" style={{ cursor: 'pointer'}} onClick={() => deleteProperty(card._id)}></i>
                                            <i
                                                className="far fa-edit mx-2"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleEditClick(card)}
                                            ></i>
                                        </div>
                                    </div>
                                    <p className="card-text mb-1">{card.address}</p>
                                    <p className="card-text mb-0">{card.condition}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
