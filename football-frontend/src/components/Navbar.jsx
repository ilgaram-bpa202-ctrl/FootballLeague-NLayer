import { NavLink, useLocation } from 'react-router-dom';
import { hasAdminRole, isAuthenticated } from '../utils/auth';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(hasAdminRole());
  const { totalItems } = useCart();

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    setIsAdmin(hasAdminRole());
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Football League</div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/news" className={({ isActive }) => (isActive ? 'active' : '')}>
            News
          </NavLink>
        </li>
        <li>
          <NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink to="/teams" className={({ isActive }) => (isActive ? 'active' : '')}>
            Teams
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/matches"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Matches
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Cart{totalItems > 0 ? ` (${totalItems})` : ''}
          </NavLink>
        </li>

        {!isLoggedIn && (
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Register
            </NavLink>
          </li>
        )}

        {isLoggedIn && isAdmin && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Admin
            </NavLink>
          </li>
        )}

        <li>
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Login
            </NavLink>
          ) : (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;