import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';import '../styles/LoginPage.css';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/auth/signup', {
        name,
        email,
        password,
      });

      // Wait for 2 seconds before redirecting to the login page
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during signup.');
      }
      console.error('Error during signup:', error);
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
        <div className='row'>
          <div className='col-md-12 text-center'><h2 className='maintext'>Signup</h2></div>
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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

export default SignupPage;
