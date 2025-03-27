import React from 'react'
import {Link} from 'react-router-dom'
import Fields from './Fields';
import Residential from './Residential';
import Commercial from './Commercial';
import Companies from './Companies';
import Client from './Client';
import Footer from './Footer';

function Home() {
  return (
    <>
    <Fields />
    {/* <!-- WhatsApp Button --> */}
    <Link to="https://wa.me/+918850093749" class="whatsapp-button" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
    </Link>
    <Residential />
    <Commercial />
    <Companies />
    <Client />

    <Footer />
    </>
  )
}

export default Home
