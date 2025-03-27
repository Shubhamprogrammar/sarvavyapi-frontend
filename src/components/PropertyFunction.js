import React from 'react';
import { Link } from 'react-router-dom';

export default function LoggedUser() {
  return (
    <div>
      <nav className="navbar-logged">
        <div>
          {/* Menu Links */}
          <ul className="navbar-links">
            <li>
              <Link to="/add">Add Properties</Link>
            </li>
            <li>
              <Link to="/view">View Properties</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
