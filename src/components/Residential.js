import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import SarvavyapiContext from '../context/sarvavyapi/SarvavyapiContext';

export default function Residential() {
    const { residentialProperties, getResidentialProperty, userContacts } = useContext(SarvavyapiContext);

    useEffect(() => {
        getResidentialProperty();
    }, []); 

    return (
        <div className="container py-0 mt-2">
            <h2 className="mb-4">Featured Residential Properties</h2>
            {Array.isArray(residentialProperties) && residentialProperties.length === 0 ? (
                <div className="alert alert-dark text-center">No Residential properties available</div>
            ) : (
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        576: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                    }}
                >
                    {residentialProperties.map((card, index) => (
                        <SwiperSlide key={index}>
                            <div className="card property-card mx-auto">
                                <img
                                    src={card.image}
                                    className="card-img-top"
                                    alt={card.name}
                                />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{card.name}</h5>
                                    <p className="card-text mb-1">Size: {card.size}sq.ft.</p>
                                    <p className="card-text mb-1">{card.address}</p>
                                    <p className="card-text mb-2">{card.condition}</p>
                                    {userContacts[card.user] && (
                                        <p className="card-text mb-2">Mobile: +91 {userContacts[card.user]?.contact}</p>
                                    )}
                                    <div className="mt-auto text-center">
                                        <Link to={`/appointment/${card._id}`} className="btn btn-primary">Book Appointment</Link>
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
