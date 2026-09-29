import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/tickets" className="navbar-brand">
          Support Tickets
        </Link>
        {user ? (
          <div className="navbar-menu">
            <Link to="/tickets" className="nav-link">My Tickets</Link>
            <Link to="/tickets/create" className="nav-link">Create Ticket</Link>
            <span className="nav-user">
              Welcome, {user.name}
            </span>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
