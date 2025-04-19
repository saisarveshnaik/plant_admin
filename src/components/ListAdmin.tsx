import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';import DataTable from 'react-data-table-component';
import Endpoints from '../endpoints';
import { Modal, Button, Form, ToastContainer, Toast } from 'react-bootstrap';

// Define the type for the data (data structure)
interface AdminData {
  id: string;
  adminName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Sample data
const ListAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<AdminData[]>([]);
  const [filteredData, setFilteredData] = useState(data);
  const token = localStorage.getItem('authToken');

  const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState('');
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(Endpoints.Auth.GET,
          { headers: { token: token || '' } }
        );
        if (res.data?.status) {
          const formattedData = res.data.data.map((admin: any) => ({
            id: admin._id,
            adminName: admin.name,
            email: admin.email,
            role: admin.role,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          }));
          setData(formattedData);
          setFilteredData(formattedData);
        }
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      }
    };

    fetchAdmins();
  }, []);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on the query
    const filtered = data.filter(
      (item) =>
        item.adminName.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(Endpoints.Auth.DELETE(id), { headers: { token: token || '' } });

      setToastMessage('Admin deleted successfully!');
    setShowToast(true);
      setFilteredData(filteredData.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting admin:', err);
      setToastMessage('Failed to add admin.');
      setShowToast(true);
    }
  };

  // Columns for DataTable
  const columns = [
    {
      name: 'Admin Name',
      selector: (row: AdminData) => row.adminName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: AdminData) => row.email,
    },
    {
      name: 'Role',
      selector: (row: AdminData) => row.role,
    },
    {
      name: 'Created At',
      selector: (row: AdminData) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Last Activity',
      selector: (row: AdminData) => new Date(row.updatedAt).toLocaleString(),
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: AdminData) => (
        <button
          onClick={() => handleDelete(row.id)}
          style={{
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          Delete Admin
        </button>
      ),
    },
  ];

  return (
    <div>

<ToastContainer position="top-end" className="p-3">
  <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
    <Toast.Body>{toastMessage}</Toast.Body>
  </Toast>
</ToastContainer>
      <input
        className='form-control'
        type="text"
        placeholder="Search by admin name, email, or role"
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      <div className="my-3">
      </div>
      {/* Data Table */}
      <DataTable
        title="View/Delete Admins"
        columns={columns}
        data={filteredData} // Use filtered data for the table
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default ListAdmin;
