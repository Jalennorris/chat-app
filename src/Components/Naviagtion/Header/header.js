import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faCog, faMoon } from '@fortawesome/free-solid-svg-icons';
import useThemeStore from '../../../Store/themeStore'; // Import useThemeStore from ThemeStore.js


import './header.css';

export function Header() {
  const [userName, setUserName] = useState(localStorage.getItem('username') || '');
  const { theme, setTheme,clearTheme } = useThemeStore(); // Use useThemeStore hook
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    clearTheme();
    setUserName('');
    navigate('/login');
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist theme in localStorage
  };

  return (
    <header className={`header-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <Link to="/" className="header-title" style={{ textDecoration: 'none' }}>
        <h1>Chat App</h1>
      </Link>
      <Link to="/settings" className="settings-button">
        <FontAwesomeIcon className="settings-icon" icon={faCog} />
      </Link>
      <div className="user-section">
        {userName ? (
          <div className="user-greeting">
            <p>{userName}</p>
          </div>
        ) : (
          <Link to="/login" className="header-button">
            Log in
          </Link>
        )}
        {userName && (
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        )}
      </div>
      <button className={`theme-toggle-button ${theme} === dark ? dark-theme : ligh-theme`} onClick={handleThemeChange}>
      <FontAwesomeIcon icon={faMoon} />
       
      </button>
    </header>
  );
}

export default Header;



