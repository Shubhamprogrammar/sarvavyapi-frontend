import React, { useState, useRef, useEffect, useContext } from 'react'
import { useParams} from 'react-router-dom';
import emailjs from "@emailjs/browser";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import SarvavyapiContext from '../context/sarvavyapi/SarvavyapiContext';
import { FaCalendarAlt } from "react-icons/fa";

export default function Appointment() {
  // Get URL parameters
  const { propertyId } = useParams();
  const host = process.env.REACT_APP_BACKEND_URL;
  const emailRef = useRef();
  const nameRef = useRef();
  const contactRef = useRef();
  const [loading, setLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const { addAppointment, userContacts, fetchUserDetails } = useContext(SarvavyapiContext);

  useEffect(() => {
    emailjs.init("JTSqY7vk-kuMiu1OH");
    
    // Fetch property details if propertyId is available
    const fetchPropertyDetails = async () => {
      if (propertyId) {
        try {
          const response = await fetch(`${host}/api/property/getallpropertyappt?propertyId=${propertyId}`);
          if (response.ok) {
            const data = await response.json();
            console.log("Property data fetched:", data);
            if (data.length > 0) {
              setPropertyDetails(data[0]);
              
              // If the property has a user ID, fetch user details
              if (data[0].user) {
                fetchUserDetails(data[0].user);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching property details:", error);
        }
      }
    };
    
    fetchPropertyDetails();
  }, [propertyId, fetchUserDetails]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    date: null,
    propertyId: propertyId || "",
  });

  useEffect(() => {
    // Update form data when URL parameters change
    setFormData(prevData => ({
      ...prevData,
      propertyId: propertyId || "",
    }));
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailRef.current.value) {
      alert("Email field is required!");
      return;
    }

    const serviceId = "service_84jgr5f";
    const templateId = "template_jcye8xf";

    const serviceIdSeller = "service_84jgr5f";
    const templateIdSeller = "template_z2u1glh";

    try {
      setLoading(true);

      const success = await addAppointment({
        name: formData.name,
        email: formData.email,
        mobile: formData.contact,
        appointmentDate: formData.date,
        propertyId: formData.propertyId,
      });

      if (success) {
        await emailjs.send(serviceId, templateId, {
          name: nameRef.current.value,
          recipient: emailRef.current.value,
          email: emailRef.current.value,
          contact: contactRef.current.value,
          date: formData.date ? formData.date.toISOString().split('T')[0] : '',
          property_name: propertyDetails.name,
          address:userContacts[propertyDetails.user].address,
        });
        await emailjs.send(serviceIdSeller, templateIdSeller, {
          name: userContacts[propertyDetails.user].name,
          recipient: userContacts[propertyDetails.user].email,
          buyer:nameRef.current.value,
          email: emailRef.current.value,
          contact: contactRef.current.value,
          date: formData.date ? formData.date.toISOString().split('T')[0] : '',
          property_name: propertyDetails.name,
          address:userContacts[propertyDetails.user].address,
        });

        alert("Appointment details have been sent to your email.");
      } else {
        alert("Failed to book appointment.");
      }

      setFormData({ 
        name: "", 
        email: "", 
        contact: "", 
        date: null,
        propertyId: propertyId || "",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 w-50 mx-auto shadow-lg p-4 rounded">
      <div className="row">
        <h2 className="text-center mb-4">Appointment Form</h2>
        
        {/* Property Details Section */}
        {propertyDetails && (
          <div className="mb-3 text-center">
          <h5>  {propertyDetails.name} ({propertyDetails.address}, {propertyDetails.city})</h5>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              ref={nameRef}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              ref={emailRef}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact" className="form-label">Contact</label>
            <input
              type="text"
              className="form-control"
              id="contact"
              name="contact"
              ref={contactRef}
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          {/* Hidden fields for property information */}
          <input type="hidden" name="propertyId" value={formData.propertyId} />

          {/* Updated Date Picker UI */}
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Appointment Date</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaCalendarAlt />
              </span>
              <DatePicker 
                selected={formData.date}
                onChange={handleDateChange}
                minDate={new Date()} // Prevent past dates
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Select a Date"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-100" 
            disabled={loading} 
            style={{ backgroundColor: "#1A237E", color: "white" }} 
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}