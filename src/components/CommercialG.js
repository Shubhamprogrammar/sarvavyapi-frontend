import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SarvavyapiContext from '../context/sarvavyapi/SarvavyapiContext';

export default function CommercialG() {
    const { commercialProperties, getCommercialProperty, userContacts } = useContext(SarvavyapiContext);

    useEffect(() => {
        getCommercialProperty();
    }, []); 

    return (
        <div className="container py-3">
            <h2 className="mb-4 text-center">Commercial Properties</h2>
            {Array.isArray(commercialProperties) && commercialProperties.length === 0 ? (
                <div className="alert alert-dark text-center">No Commercial properties available</div>
            ) : (
                <div className="row g-3">
                    {commercialProperties.map((card, index) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex" key={index}>
                            <div className="card h-100 shadow-sm w-100 p-2 d-flex flex-column">
                                <img
                                    src={card.image}
                                    className="card-img-top"
                                    alt={card.name}
                                    style={{ height: "10rem", objectFit: "cover" }}
                                />
                                <div className="card-body d-flex flex-column p-2" style={{ flex: "1 1 auto" }}>
                                    <h6 className="card-title mb-1">{card.name}</h6>
                                    <p className="card-text mb-1">Size: {card.size} sq.ft.</p>
                                    <p className="card-text mb-1">{card.address}</p>
                                    <p className="card-text">{card.condition}</p>
                                    {userContacts[card.user] && (
                                        <p className="card-text">Mobile: +91 {userContacts[card.user]?.contact}</p>
                                    )}
                                    <div className="mt-auto">
                                        <Link to={`/appointment/${card._id}`} className="btn btn-sm btn-primary w-100">
                                            Book Appointment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
