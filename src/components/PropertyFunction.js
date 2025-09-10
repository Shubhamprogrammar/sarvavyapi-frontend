import React from 'react';
import { NavLink } from 'react-router-dom';

export default function LoggedUser() {
  return (
    <div>
      <nav className="navbar-logged">
        <div>
          {/* Menu Links */}
          <ul className="navbar-links">
            <li>
              <NavLink 
                to="/add" 
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                Add Properties
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/view" 
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                View Properties
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
