import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await axios.post('http://localhost:8000/api/accountUser', formData);
      // Handle successful login
      console.log('Login successful!', response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginError('Invalid email or password');
      } else {
        setLoginError('Login failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {loginError && <p>{loginError}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;