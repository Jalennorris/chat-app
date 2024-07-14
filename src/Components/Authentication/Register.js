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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      console.log('Registering user with data:', userData);
  
      const response = await axios.post('/users/register', userData);
  
      if (response.status === 201 && response.data) {
        console.log('User registration successful');
        navigate('/login');
      } else {
        setErrorMessage('Unexpected error occurred.');
      }
    } catch (error) {
      console.error('Error occurred during user registration:', error);
  
      if (error.response) {
        const { data } = error.response;
        if (error.response.status === 400) {
          // Handle validation errors (e.g., username/email already exists)
          setErrorMessage(data.message || 'Validation error occurred.');
        } else if (error.response.status === 500) {
          // Handle server errors
          console.error('Server error details:', data.error);
          setErrorMessage(data.message || 'An unexpected server error occurred.');
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        setErrorMessage('No response from server. Please check your internet connection and try again.');
      } else {
        console.error('Error setting up request:', error.message);
        setErrorMessage('An error occurred. Please try again.');
      }
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



