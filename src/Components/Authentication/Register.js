import React, { useState } from 'react';
import axios from 'axios';
import { Header } from '../Naviagtion/Header/header';
import { Link, useNavigate } from 'react-router-dom';

import './register.css';

const Register = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_name: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setUserData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/register', userData);
      if (response.data.status === 'success') {
        console.log('User registration successful');
      } else {
        setErrorMessage(response.data.message);
      }
      Navigate('/login');
    } catch (error) {
      console.error('Error occurred during user registration:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <h1>Create your account!</h1>
        <p>
          Already signed up? <Link to="/login">Log In</Link>
        </p>
        <form className="register-form" onSubmit={handleRegister}>
          <div>
            <label className="register-label">
              First Name:
              <input
                className="register-input"
                type="text"
                name="first_name"
                placeholder="First Name"
                value={userData.first_name}
                onChange={handleChange}
              />
            </label>
           
          </div>
          <div>
            <label className="register-label">
              Last Name:
              <input
                className="register-input"
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={userData.last_name}
                onChange={handleChange}
              />
            </label>
            
          </div>
          <div>
            <label className="register-label">
              Email:
              <input
                className="register-input"
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
              />
            </label>
           
          </div>
          <div>
            <label className="register-label">
              Phone:
              <input
                className="register-input"
                type="tel"
                name="phone"
                placeholder="Phone"
                value={userData.phone}
                onChange={handleChange}
              />
            </label>
           
          </div>
          <div>
            <label className="register-label">
              Username:
              <input
                className="register-input"
                type="text"
                name="user_name"
                placeholder="Username"
                value={userData.user_name}
                onChange={handleChange}
              />
            </label>
            
          </div>
          <div>
            <label className="register-label">
              Password:
              <input
                className="register-input"
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
              />
            </label>
           
          </div>
          <button className="register-button" type="submit">
            Register
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Register;



