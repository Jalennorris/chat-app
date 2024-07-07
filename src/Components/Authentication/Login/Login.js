import React, { useState } from 'react';
import './login.css';
import { Header } from '../../Naviagtion/Header/header';
import { Link, useNavigate } from 'react-router-dom';


import axios from 'axios';
import useAuthStore from '../../../Store/authStore';

export function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ user_name: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const setUserId = useAuthStore((state) => state.setUserId);
  

  const handleLogin = async () => {
    try {
      if (!credentials.user_name || !credentials.password) {
        setErrorMessage('Username and password are required');
        return;
      }

      const response = await axios.post('/users/login', credentials);

      if (response.data.status === "success") {
        const { user_name, user_id, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', user_name);
        localStorage.setItem('userId', user_id);
        setUserId(user_id); // Update userId in the authentication context
        navigate('/chat');
      } else {
        console.error('Login failed:', response.data.message);
        setErrorMessage(response.data.message);
      }

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Header/>
      <div className="login-container ">
        <h1> Welcome Back!</h1>
        <p>Please Login in to your account.</p>
        <form className='login-form'>
          <label className='login-label'>Username: </label>
          <input className='login-input' placeholder='Username' type="text" name="user_name" value={credentials.user_name} onChange={handleChange} />
          <label className='login-label'>Password: </label>
          <input className='login-input' placeholder='Password' type="password" name="password" value={credentials.password} onChange={handleChange} />
          <button className='login-button' type="button" onClick={handleLogin}>LOG IN</button>
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
        </form>
        <p className='login-text'>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}

export default Login;









