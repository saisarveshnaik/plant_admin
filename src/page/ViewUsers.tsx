import React from 'react';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ListUsers from '../components/ListUsers';

const ViewUsers: React.FC = () => {
  return (
    <div className="cards-outer">
        <div className='users-table-div'>
        <ListUsers />
        </div>
    </div>
  );
};

export default ViewUsers;
