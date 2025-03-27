import React from 'react';

export default function Client() {
    return (
        <div className="container py-4">
            <h3 className="mb-4">What Our Clients Say</h3>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                <div className="col d-flex">
                    <div className="card shadow-lg h-100 w-100">
                        <div className="card-body">
                            <p className="card-text">The website is intuitive and easy to navigate. Searching for properties is seamless, and the filters help narrow down options efficiently.</p>
                            <h5 className="card-title">Sundar Pichai</h5>
                        </div>
                    </div>
                </div>
                <div className="col d-flex">
                    <div className="card shadow-lg h-100 w-100">
                        <div className="card-body">
                            <p className="card-text">I appreciate the approval system for property listings. It ensures that only verified listings are displayed, adding credibility and trust.</p>
                            <h5 className="card-title">Jeff Bezos</h5>
                        </div>
                    </div>
                </div>
                <div className="col d-flex">
                    <div className="card shadow-lg h-100 w-100">
                        <div className="card-body">
                            <p className="card-text">The pages load quickly, and the overall performance is smooth across devices. It feels professional and well-optimized.</p>
                            <h5 className="card-title">Tim Cook</h5>
                        </div>
                    </div>
                </div>
                <div className="col d-flex">
                    <div className="card shadow-lg h-100 w-100">
                        <div className="card-body">
                            <p className="card-text">No hidden costs or misleading listings. Everything is presented clearly, making it easier to make informed decisions.</p>
                            <h5 className="card-title">Elon Musk</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
