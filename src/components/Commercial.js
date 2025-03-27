import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import SarvavyapiContext from '../context/sarvavyapi/SarvavyapiContext';

export default function Commercial() {
    const { commercialProperties, getCommercialProperty, userContacts } = useContext(SarvavyapiContext);

    useEffect(() => {
        getCommercialProperty();
    }, []); // Removed dependency to avoid unnecessary re-renders

    return (
        <div className="container">
            <h2 className="mb-4">Featured Commercial Properties</h2>
            {Array.isArray(commercialProperties) && commercialProperties.length === 0 ? (
                <div className="alert alert-dark text-center">No Commercial properties available</div>
            ) : (
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        576: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        992: { slidesPerView: 3, spaceBetween: 20 },
                        1200: { slidesPerView: 4, spaceBetween: 20 },
                    }}
                >
                    {commercialProperties.map(({ _id, image, name, size, address, condition, user }) => (
                        <SwiperSlide key={_id} style={{ display: "flex", justifyContent: "center" }}>
                            <div className="card mx-auto d-flex flex-column h-100" style={{ maxWidth: "18rem", minHeight: "100%" }}>
                                <img
                                    src={image || "/default-image.jpg"} // Fallback image
                                    className="card-img-top"
                                    alt={name}
                                    style={{ height: "12rem", objectFit: "cover" }}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{name}</h5>
                                    <p className="card-text mb-1">Size: {size} sq.ft.</p>
                                    <p className="card-text mb-1">{address}</p>
                                    <p className="card-text mb-2">{condition}</p>

                                    {userContacts?.[user] && (
                                        <p className="card-text mb-2">Mobile: +91 {userContacts[user]?.contact}</p>
                                    )}

                                    <div className="mt-auto text-center">
                                        <Link to={`/appointment/${_id}`} className="btn btn-primary">Book Appointment</Link>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
}
