import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

// Define the type for the data (data structure)
interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  joiningDate: string;
  joiningTime: string;
  lastLogin: string;
  accountStatus: string;
}

// Sample data with the additional user fields
const data: UserData[] = [
  {
    id: 1,
    fullName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Springfield, IL',
    joiningDate: '2024-01-01',
    joiningTime: '10:00 AM',
    lastLogin: '2025-01-10',
    accountStatus: 'Active',
  },
  {
    id: 2,
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '987-654-3210',
    address: '456 Oak St, Chicago, IL',
    joiningDate: '2024-02-15',
    joiningTime: '9:30 AM',
    lastLogin: '2025-01-15',
    accountStatus: 'Pending',
  },
  {
    id: 3,
    fullName: 'Emily Wong',
    email: 'emily.wong@example.com',
    phone: '456-789-1230',
    address: '789 Pine St, San Francisco, CA',
    joiningDate: '2024-03-10',
    joiningTime: '11:00 AM',
    lastLogin: '2025-01-12',
    accountStatus: 'Active',
  },
];

const ListUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on the query
    const filtered = data.filter(
      (item) =>
        item.fullName.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        item.address.toLowerCase().includes(query) ||
        item.accountStatus.toLowerCase().includes(query)
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
      name: 'Full Name',
      selector: (row: UserData) => row.fullName,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: UserData) => row.email,
    },
    {
      name: 'Phone',
      selector: (row: UserData) => row.phone,
    },
    {
      name: 'Address',
      selector: (row: UserData) => row.address,
    },
    {
      name: 'Joining Date',
      selector: (row: UserData) => row.joiningDate,
    },
    {
      name: 'Joining Time',
      selector: (row: UserData) => row.joiningTime,
    },
    {
      name: 'Last Login',
      selector: (row: UserData) => row.lastLogin,
    },
    {
      name: 'Account Status',
      selector: (row: UserData) => row.accountStatus,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: UserData) => (
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
          Delete User
        </button>
      ),
    },
  ];

  return (
    <div>
      <input
        className="form-control"
        type="text"
        placeholder="Search by full name, email, phone, address, or status"
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
        title="View/Delete Users"
        columns={columns}
        data={filteredData} // Use filtered data for the table
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default ListUsers;
