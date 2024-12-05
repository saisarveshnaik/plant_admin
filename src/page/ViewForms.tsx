import React, { useEffect, useState } from 'react';
import '../styles/ViewForms.css';
import { Button } from 'react-bootstrap';

const ViewForms: React.FC = () => {
  const [forms, setForms] = useState<any[]>([]);

  // Fetch all forms from the view_join_us.php API
  const fetchForms = async () => {
    try {
      const response = await fetch('https://api.gamingpandastudios.com/api/view_join_us.php', {
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        setForms(data.data); // Assuming data.data contains the list of forms
      } else {
        console.error('Error fetching forms:', data.message);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  // Delete form by calling delete_join_us.php API
  const handleDelete = async (id: number) => {
    const confirmation = window.confirm('Are you sure you want to delete this form?');
    if (confirmation) {
      try {
        const response = await fetch('https://api.gamingpandastudios.com/api/delete_join_us.php', {
          method: 'POST',
          body: new URLSearchParams({ id: id.toString() }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const data = await response.json();

        if (data.success) {
          alert('Form deleted successfully');
          fetchForms(); // Re-fetch the updated list of forms
        } else {
          alert('Failed to delete form: ' + data.message);
        }
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Error deleting form');
      }
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="container mt-4" id="ViewForms">
      <h1>View Forms</h1>

      <table className="table table-responsive mt-4">
        <thead>
          <tr>
            <th>Form ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Designation</th>
            <th>CV</th>
            <th>Cover</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {forms.length > 0 ? (
            forms.map((form) => (
              <tr key={form.id}>
                <td>{form.id}</td>
                <td>{form.name}</td>
                <td>{form.email}</td>
                <td>{form.location}</td>
                <td>{form.designation}</td>
                <td>
                  <a href={`https://api.gamingpandastudios.com/api/${form.cv}`} target="_blank" rel="noopener noreferrer">Download</a>
                </td>
                <td>{form.cover}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(form.id)}
                  >
                    Delete Form
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No forms available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewForms;
