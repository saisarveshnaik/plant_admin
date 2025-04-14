import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';
import Endpoints from '../endpoints';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        Endpoints.Auth.LOGIN,
        { email, password }
      );

      // Log the full response to inspect the data structure
      console.log('API response:', response.data);

      // Adjust token extraction based on the API response structure.
      // For example, if the token is nested inside a "data" property:
      const token =
        response.data.token ||
        (response.data.data && response.data.data.token);

      if (!token) {
        throw new Error('Authentication token not found in response.');
      }

      // Save the token in local storage
      localStorage.setItem('authToken', token);

      // Wait for 2 seconds before redirecting
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      // Check for an error message from the API response; otherwise, use a generic message.
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during login.');
      }
      console.error('Error during login:', err);
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://i.ibb.co/xjq14Xd/footer-logo.png"
        alt="Logo"
        className="logo-img"
      />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Display error message if there is any */}
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
