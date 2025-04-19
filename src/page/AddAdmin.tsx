import React from 'react';
import { useState } from 'react';
import '../styles/AddAdmin.css';
import { Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../utils/axiosInstance';import Endpoints from '../endpoints';

const AddAdmin: React.FC = () => {

  const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState('');

  const handleAddAdmin = async () => {
    const newAdmin = {
      email: (document.getElementById("email_address") as HTMLInputElement).value,
      password: (document.getElementById("password") as HTMLInputElement).value,
      name: (document.getElementById("full_name") as HTMLInputElement).value,
    };

    try {
      const response = await axios.post(Endpoints.Auth.ADD, newAdmin);
      setToastMessage('Admin added successfully!');
    setShowToast(true);
      document.querySelector('form')?.reset();
    } catch (error) {
      console.error("Error adding admin:", error);
      
    setToastMessage('Failed to add admin.');
    setShowToast(true);
    }
  };
  return (
    <div className="cards-outer">

<ToastContainer position="top-end" className="p-3">
  <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
    <Toast.Body>{toastMessage}</Toast.Body>
  </Toast>
</ToastContainer>
       <div className='row'>
        <div className='col-md-8'>
         
        <div className='form-inner'>
      <h1>Add Admin</h1>

      <form>

        <div className='row'>
          <div className='col-md-6'>
          <div className="form-group">
          <label htmlFor="full_name" className="form-label">
            Full Name:
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            className="form-control"
            placeholder="Enter Full Name"
          />
        </div>
          </div>
          <div className='col-md-6'>
          <div className="form-group">
          <label htmlFor="email_address" className="form-label">
          Email Address:
          </label>
          <input
            type="text"
            id="email_address"
            name="email_address"
            className="form-control"
            placeholder="Enter email address"
          />
        </div>
          </div>
          <div className='col-md-6'>
          <div className="form-group">
          <label htmlFor="phone_number" className="form-label">
          Phone Number:
          </label>
          <input
            type="number"
            id="phone_number"
            name="phone_number"
            className="form-control"
            placeholder="Enter phone number"
          />
        </div>
          </div>
          {/* <div className='col-md-4'>
          <div className="form-group">
          <label htmlFor="username" className="form-label">
          Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-control"
            placeholder="Enter username"
          />
        </div>
          </div> */}
          <div className='col-md-6'>
          <div className="form-group">
          <label htmlFor="password" className="form-label">
          Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Enter Password"
          />
        </div>
          </div>
          {/* <div className='col-md-4'>
          <div className="form-group">
          <label htmlFor="confirm_password" className="form-label">
          Confirm Password:
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            className="form-control"
            placeholder="Re-enter password"
          />
        </div>
          </div> */}
        </div>
        

        {/* <div className="form-group mt-3">
          <label htmlFor="description" className="form-label">
            Blog Description
          </label>
          <ReactQuill
            id="description"
            value="<p>Sample blog description content</p>"
            readOnly
          />
        </div> */}

        {/* <div className="form-group mt-3">
          <label htmlFor="image" className="form-label">
            Blog Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            accept="image/*"
          />
        </div> */}

        <button type="button" className="form-control btn btn-primary mt-4" onClick={handleAddAdmin}>
          Submit
        </button>
      </form>

      </div>


        </div>
        </div> 

    </div>
  );
};

export default AddAdmin;
