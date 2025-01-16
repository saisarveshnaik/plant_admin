import React from 'react';
import '../styles/AddAdmin.css';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddAdmin: React.FC = () => {
  return (
    <div className="cards-outer">

       <div className='row'>
        <div className='col-md-8'>
         
        <div className='form-inner'>
      <h1>Add Admin</h1>

      <form>

        <div className='row'>
          <div className='col-md-4'>
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
          <div className='col-md-4'>
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
          <div className='col-md-4'>
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
          <div className='col-md-4'>
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
          </div>
          <div className='col-md-4'>
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
          <div className='col-md-4'>
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
          </div>
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

        <button type="button" className="form-control btn btn-primary mt-4">
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
