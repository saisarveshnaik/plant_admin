import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

// Define the type for the data (data structure)
interface UserData {
  id: number;
  name: string;
  age: number;
  country: string;
  joiningDate: string;
  joiningTime: string;
  email: string;
  status: string;
}

// Sample data
const data: UserData[] = [
  { id: 1, name: 'Alice Johnson', age: 25, country: 'USA', joiningDate: '2025-01-15', joiningTime: '14:30:00', email: 'alice.johnson@example.com', status: 'Active' },
  { id: 2, name: 'Rajesh Kumar', age: 30, country: 'India', joiningDate: '2025-01-15', joiningTime: '15:00:00', email: 'rajesh.kumar@example.com', status: 'Pending' },
  { id: 3, name: 'Emily Wong', age: 28, country: 'Singapore', joiningDate: '2025-01-15', joiningTime: '16:20:00', email: 'emily.wong@example.com', status: 'Active' },
  // Add more placeholder data as needed
];

// Columns for DataTable
const columns = [
  {
    name: 'Name',
    selector: (row: UserData) => row.name,
    sortable: true,
  },
  {
    name: 'Age',
    selector: (row: UserData) => row.age,
    sortable: true,
  },
  {
    name: 'Country',
    selector: (row: UserData) => row.country,
    sortable: true,
  },
  {
    name: 'Joining Date',
    selector: (row: UserData) => row.joiningDate,
    sortable: true,
  },
  {
    name: 'Joining Time',
    selector: (row: UserData) => row.joiningTime,
    sortable: true,
  },
  {
    name: 'Email',
    selector: (row: UserData) => row.email,
  },
  {
    name: 'Status',
    selector: (row: UserData) => row.status,
    sortable: true,
  },
];

const Last24hrUsers: React.FC = () => {
  // State for the search query and filtered data
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on the query
    const filtered = data.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.country.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  return (
    <div>
      <input
        className='form-control'
        type="text"
        placeholder="Search by name, country, email, or status"
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
        title="Users joined in last 24hrs"
        columns={columns}
        data={filteredData} // Use filtered data for the table
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default Last24hrUsers;
