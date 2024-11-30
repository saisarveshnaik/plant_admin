import React from 'react';
import '../styles/Table.css';
import { FaUserCircle, FaFlag, FaCreditCard, FaRunning } from 'react-icons/fa';

const Table: React.FC = () => {
  const users = [
    {
      id: 1,
      profilePic: 'https://via.placeholder.com/50',
      name: 'John Doe',
      country: 'USA',
      paymentMethod: 'Credit Card',
      activity: 'Active',
    },
    {
      id: 2,
      profilePic: 'https://via.placeholder.com/50',
      name: 'Jane Smith',
      country: 'Canada',
      paymentMethod: 'PayPal',
      activity: 'Inactive',
    },
    {
      id: 3,
      profilePic: 'https://via.placeholder.com/50',
      name: 'Emily Johnson',
      country: 'UK',
      paymentMethod: 'Bank Transfer',
      activity: 'Active',
    },
    // Add more user data as needed
  ];

  return (
    <div className="table-container table-responsive">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Profile</th>
            <th>User</th>
            <th>Country</th>
            <th>Payment Method</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <img src={user.profilePic} alt="Profile" className="profile-pic" />
              </td>
              <td>{user.name}</td>
              <td>
                <FaFlag className="icon" /> {user.country}
              </td>
              <td>
                <FaCreditCard className="icon" /> {user.paymentMethod}
              </td>
              <td>
                <FaRunning className="icon" /> {user.activity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
