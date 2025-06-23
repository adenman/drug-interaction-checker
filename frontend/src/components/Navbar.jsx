import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ loggedIn, username, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">DrugChecker</div>
      <div className="nav-links">
        {loggedIn ? (
          <>
            <NavLink to="/dashboard">Checker</NavLink>
            <NavLink to="/saved-tests">Saved Tests</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
      {loggedIn && (
        <div className="nav-user-section">
          <span>Welcome, {username}</span>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;