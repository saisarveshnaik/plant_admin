import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

// Define the type for the data (data structure)
interface AdminData {
  id: number;
  adminName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  status: string;
}

// Sample data
const data: AdminData[] = [
  { id: 1, adminName: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '123-456-7890', username: 'alice.j', password: 'password123', status: 'Active' },
  { id: 2, adminName: 'Rajesh Kumar', email: 'rajesh.kumar@example.com', phone: '987-654-3210', username: 'rajesh.k', password: 'securePass456', status: 'Pending' },
  { id: 3, adminName: 'Emily Wong', email: 'emily.wong@example.com', phone: '456-789-1230', username: 'emily.w', password: 'myPassword789', status: 'Active' },
];

const ListAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on the query
    const filtered = data.filter(
      (item) =>
        item.adminName.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.username.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  // Handle delete action
  const handleDelete = (id: number) => {
    const updatedData = filteredData.filter((item) => item.id !== id);
    setFilteredData(updatedData);
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
      name: 'Phone',
      selector: (row: AdminData) => row.phone,
    },
    {
      name: 'Username',
      selector: (row: AdminData) => row.username,
    },
    {
      name: 'Password',
      selector: (row: AdminData) => row.password,
    },
    {
      name: 'Status',
      selector: (row: AdminData) => row.status,
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
      <input
        className='form-control'
        type="text"
        placeholder="Search by admin name, email, phone, username, or status"
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
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
