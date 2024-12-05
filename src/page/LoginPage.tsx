// LoginPage.tsx
import React, { useState } from 'react';
import '../styles/LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://api.gamingpandastudios.com/api/login.php', {
        email,
        password,
      });

      if (response.data.status === 'success') {
        localStorage.setItem('authToken', response.data.token);
        setIsAuthenticated(true);
        navigate('/'); // Redirect to the dashboard after login
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <img
          src="https://i.ibb.co/xjq14Xd/footer-logo.png"
          alt="Logo"
          className="logo-img"
        />
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
