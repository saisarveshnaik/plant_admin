import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

// Define the type for the data (data structure)
interface UserData {
  id: number;
  email: string;
  joinedDate: string;
  lastLogin: string;
  accessLevel: 'LVL1' | 'LVL2' | 'LVL3';
}

// Sample data
const data: UserData[] = [
  {
    id: 1,
    email: 'alice.johnson@example.com',
    joinedDate: '2024-01-01',
    lastLogin: '2025-01-10',
    accessLevel: 'LVL1',
  },
  {
    id: 2,
    email: 'rajesh.kumar@example.com',
    joinedDate: '2024-02-15',
    lastLogin: '2025-01-15',
    accessLevel: 'LVL2',
  },
  {
    id: 3,
    email: 'emily.wong@example.com',
    joinedDate: '2024-03-10',
    lastLogin: '2025-01-12',
    accessLevel: 'LVL3',
  },
];

const ListUserAccess: React.FC = () => {
  const [users, setUsers] = useState(data);

  const handleAccessLevelChange = (id: number, newAccessLevel: 'LVL1' | 'LVL2' | 'LVL3') => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, accessLevel: newAccessLevel } : user
      )
    );
  };

  const saveChanges = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      console.log(`Saved changes for User ID: ${id}, New Access Level: ${user.accessLevel}`);
    }
  };

  const columns = [
    {
      name: 'ID',
      selector: (row: UserData) => row.id,
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: UserData) => row.email,
    },
    {
      name: 'Joined Date',
      selector: (row: UserData) => row.joinedDate,
    },
    {
      name: 'Last Login',
      selector: (row: UserData) => row.lastLogin,
    },
    {
      name: 'Access Level',
      cell: (row: UserData) => (
        <select
          value={row.accessLevel}
          onChange={(e) => handleAccessLevelChange(row.id, e.target.value as 'LVL1' | 'LVL2' | 'LVL3')}
        >
          <option value="LVL1">LVL1</option>
          <option value="LVL2">LVL2</option>
          <option value="LVL3">LVL3</option>
        </select>
      ),
    },
    {
      name: 'Actions',
      cell: (row: UserData) => (
        <button
          onClick={() => saveChanges(row.id)}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        title="User Access Management"
        columns={columns}
        data={users}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default ListUserAccess;
