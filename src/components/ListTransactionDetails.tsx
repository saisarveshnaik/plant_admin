import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

// Define the type for the data (data structure)
interface TransactionData {
  date: string;
  user_id: number;
  orderDetails: string;
  paymentStatus: 'Complete' | 'Pending' | 'Refund';
}

// Sample data with the updated fields
const data: TransactionData[] = [
  {
    date: '2025-01-15',
    user_id: 101,
    orderDetails: 'Order #1234 - 2 items',
    paymentStatus: 'Complete',
  },
  {
    date: '2025-01-16',
    user_id: 102,
    orderDetails: 'Order #1235 - 1 item',
    paymentStatus: 'Pending',
  },
  {
    date: '2025-01-17',
    user_id: 103,
    orderDetails: 'Order #1236 - 3 items',
    paymentStatus: 'Refund',
  },
];

const ListTransactionDetails: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on the query
    const filtered = data.filter(
      (item) =>
        item.date.toLowerCase().includes(query) ||
        item.user_id.toString().includes(query) ||
        item.orderDetails.toLowerCase().includes(query) ||
        item.paymentStatus.toLowerCase().includes(query)
    );

    setFilteredData(filtered);
  };

  // Handle delete action
  const handleDelete = (user_id: number) => {
    const updatedData = filteredData.filter((item) => item.user_id !== user_id);
    setFilteredData(updatedData);
  };

  // Columns for DataTable
  const columns = [
    {
      name: 'Date',
      selector: (row: TransactionData) => row.date,
      sortable: true,
    },
    {
      name: 'User ID',
      selector: (row: TransactionData) => row.user_id,
    },
    {
      name: 'Order Details',
      selector: (row: TransactionData) => row.orderDetails,
    },
    {
      name: 'Payment Status',
      selector: (row: TransactionData) => row.paymentStatus,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row: TransactionData) => (
        <button
          onClick={() => handleDelete(row.user_id)}
          style={{
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          Delete Transaction
        </button>
      ),
    },
  ];

  return (
    <div>
      <input
        className="form-control"
        type="text"
        placeholder="Search by date, user ID, order details, or payment status"
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
        title="Transaction Details"
        columns={columns}
        data={filteredData} // Use filtered data for the table
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default ListTransactionDetails;
