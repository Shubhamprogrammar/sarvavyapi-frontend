import './App.css';
import Navbar from './components/Navbar'
import Signup from './components/Signup';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LoggedUser from './components/PropertyFunction';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ResidentialG from './components/ResidentialG';
import CommercialG from './components/CommercialG';
import About from './components/About';
import ContactUs from './components/Contact';
import News from './components/News';
import Search from './components/Search';
import AddProperties from './components/AddProperties';
import ViewProperty from './components/viewProperty';
import Profile from './components/Profile';
import Admin from './components/Admin';
import ForgotPassword from "./components/ForgetPassword";
import SarvavyapiState from './context/sarvavyapi/SarvavyapiState';
import Appointment from './components/Appointment';

function App() {
  const apiKey = process.env.REACT_APP_NEWS_API;
  const pageSize = 15;
  return (
    <SarvavyapiState>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div>
          <Router>
            <Navbar />
            {((localStorage.getItem('token') && !localStorage.getItem('adminToken'))) ?
             <LoggedUser /> : (<h2 style={{ textAlign: "center", margin: "5px" }}>Welcome to Sarvavyapi - The Real Estate</h2>)
            }
            <Routes>
              <Route exact path='/' element={<Home />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path='/profile' element={<Profile />} />
              <Route exact path='/residential' element={<ResidentialG />} />
              <Route exact path='/commercial' element={<CommercialG />} />
              <Route exact path='/about' element={<About />} />
              <Route exact path='/contact' element={<ContactUs />} />
              <Route exact path="/blog" element={<News apiKey={apiKey} pageSize={pageSize} />} />
              <Route exact path="/add" element={<AddProperties />} />
              <Route exact path="/view" element={<ViewProperty />} />
              <Route exact path='/admin-dashboard' element={<Admin />} />
              <Route exact path="/search" element={<Search />} />
              <Route exact path='/appointment/:propertyId' element={<Appointment />} />
              <Route exact path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Router>
        </div>
      </GoogleOAuthProvider>
    </SarvavyapiState>
  );
}

export default App;
