import React from 'react';
import DataTable from 'react-data-table-component';

// Define the type for the data (data structure)
interface UserData {
  id: number;
  name: string;
  age: number;
  country: string;
}

// Define columns with their names and accessors (keys for data fields)
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
];

// Sample data matching the `UserData` interface
const data: UserData[] = [
  { id: 1, name: 'John Doe', age: 28, country: 'USA' },
  { id: 2, name: 'Jane Smith', age: 32, country: 'UK' },
  { id: 3, name: 'Carlos Garcia', age: 24, country: 'Mexico' },
];

const MyDataTable: React.FC = () => {
  return (
    <div>
      <DataTable
        title="Users Table"
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default MyDataTable;
