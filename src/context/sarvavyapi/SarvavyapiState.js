import React, { useState, useEffect, useCallback } from 'react';
import SarvavyapiContext from './SarvavyapiContext';

export default function SarvavyapiState(props) {
    const host = process.env.REACT_APP_BACKEND_URL;
    const [residentialProperties, setResidentialProperties] = useState([]);
    const [commercialProperties, setCommercialProperties] = useState([]);
    const [properties, setProperties] = useState([]);
    const [userContacts, setUserContacts] = useState({});

    const addProperty = async (propertyData) => {
        try {
            const response = await fetch(`${host}/api/property/addproperty`, {
                method: "POST",
                headers: {
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: propertyData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                return false;
            }

            const result = await response.json();
            const newProperty = result.savedProperty;
            setProperties((prev)=>[...prev, newProperty]);
            if (newProperty.category === "resident") {
                setResidentialProperties((prev) => [...prev, newProperty]);
            } else if (newProperty.category === "commercial") {
                setCommercialProperties((prev) => [...prev, newProperty]);
            }
            return true;
        } catch (error) {
            console.error("Error adding property:", error);
            return false;
        }
    };

    const getResidentialProperty = async () => {
        try {
            const response = await fetch(`${host}/api/property/getallproperty?categories=resident`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch residential properties");
            }

            const json = await response.json();
            setResidentialProperties(json);
        } catch (error) {
            console.error("Error while loading residential properties:", error);
        }
    };

    const getCommercialProperty = async () => {
        try {
            const response = await fetch(`${host}/api/property/getallproperty?categories=commercial`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            setCommercialProperties(json);
        }
        catch (error) {
            console.error("Error while loading commercial properties")
        }
    }
    const viewProperties = async () => {
        try {
            const response = await fetch(`${host}/api/property/getallownproperty`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
            });
            const json = await response.json();
            setProperties(json);
        }
        catch (error) {
            console.error("Error while loading properties")
        }
    }

    const updateProperty = async (id, updatedData) => {
        try {
            const response = await fetch(`${host}/api/property/updateproperty/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': sessionStorage.getItem('token'),
                },
                body: JSON.stringify(updatedData),
            });
    
            if (!response.ok) {
                console.error("Error updating property");
                return false;
            }
    
            await response.json();
            setProperties((prevProperties) =>
                prevProperties.map((property) =>
                    property._id === id ? { ...property, ...updatedData } : property
                )
            );
    
            return true;
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    };  
    
    const deleteProperty = async (id) =>{
        let confirmation = window.confirm("Do you want to delete the property?");
        if (confirmation) {
            try {
                const response = await fetch(`${host}/api/property/deleteproperty/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': sessionStorage.getItem('token'),
                    },
                });
                await response.json();
                setProperties(properties.filter(property => property._id !== id));
            } catch (error) {
                console.error('Failed to delete heart:', error);
            }
        }
    }

    const addAppointment = async ({ name, email, mobile, appointmentDate, propertyId, propertyName }) => {
        try {
            const response = await fetch(`${host}/api/appointment/addappointment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    mobile, 
                    appointmentDate, 
                    propertyId, 
                    propertyName 
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                return false;
            }
    
            await response.json();
    
            return true;
        } catch (error) {
            console.error("Error adding appointment:", error);
            return false;
        }
    };
    

    const addFeedback = async (name, email, feedback) => {
        const response = await fetch(`${host}/api/feedback/addfeedback`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, feedback }),
        })
        await response.json();
    }

    const fetchUserDetails = useCallback(async (userId) => {
        if (!userId || userContacts[userId]) return; 

        try {
            const response = await fetch(`${host}/api/auth/profile/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch user details");

            const userData = await response.json();
            setUserContacts((prev) => ({
                ...prev,
                [userId]: { 
                    contact: userData.contact, 
                    name: userData.name, 
                    email: userData.email, 
                    address: userData.address 
                },
            }));
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    }, [userContacts]);

    useEffect(() => {
        commercialProperties.forEach((property) => {
            fetchUserDetails(property.user);
        });
        residentialProperties.forEach((property) => {
            fetchUserDetails(property.user);
        });
    }, [commercialProperties,residentialProperties, fetchUserDetails]);
    return (
        <div>
            <SarvavyapiContext.Provider value={{properties, commercialProperties, residentialProperties, userContacts, addProperty, getResidentialProperty, getCommercialProperty, viewProperties, addFeedback, addAppointment, updateProperty, deleteProperty, fetchUserDetails }}>
                {props.children}
            </SarvavyapiContext.Provider>
        </div>
    )
}
