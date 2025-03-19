import React from 'react';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ListUsers from '../components/ListUsers';
import EditableTable from '../components/EditableTable';

const ViewUsers: React.FC = () => {
  return (
    <div className="cards-outer">
        <div className='users-table-div'>
        <EditableTable />
        </div>
    </div>
  );
};

export default ViewUsers;
