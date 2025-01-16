import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = () => {
    // Handle your form submission logic here
    // After successful login or any action, redirect to the home page
    navigate('/'); // Redirect to the home page ("/")
  };

  return (
    <div className="login-container">
      <img
        src="https://i.ibb.co/xjq14Xd/footer-logo.png"
        alt="Logo"
        className="logo-img"
      />
      <form>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            required
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
