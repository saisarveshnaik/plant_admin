import React, { useState } from 'react';
import '../styles/AddBigBlog.css';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';  // Importing Quill editor
import 'react-quill/dist/quill.snow.css'; // Import the Quill styles

const AddBigBlog: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value, // Updating the description with Quill editor value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted!");  // Debugging step to confirm form submission

    // Check if all fields are filled, including description
    if (!formData.title || !formData.description || !formData.image) {
      setErrorMessage('All fields are required.');
      return;
    }

    // Create a FormData object to handle file upload
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('image', formData.image);

    try {
      // Send POST request to PHP API
      const response = await fetch('http://localhost/gamingpanda_admin/pages/addblog.php', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log(response);  // Debugging step to check if request goes through
      const data = await response.json();

      if (data.status === 'success') {
        setSuccessMessage('Blog added successfully!');
        setErrorMessage(null); // Clear any previous error messages
        setFormData({ title: '', description: '', image: null }); // Reset form
      } else {
        setErrorMessage(data.message);
        setSuccessMessage(null); // Clear any previous success messages
      }
    } catch (error) {
      console.error("Error:", error);  // Log the error in the console
      setErrorMessage('There was an error submitting the form.');
      setSuccessMessage(null); // Clear any previous success messages
    }
  };

  return (
    <div className="container mt-4">
      <h1 style={{ color: 'white' }}>Add Big Blog</h1>
      
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="description" className="form-label">
            Blog Description
          </label>
          {/* Replacing the textarea with Quill editor */}
          <ReactQuill
            id="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter blog description"
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="image" className="form-label">
            Blog Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddBigBlog;
