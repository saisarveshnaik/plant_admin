import React from 'react';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ListAdmin from '../components/ListAdmin';

const ViewAdmin: React.FC = () => {
  return (
    <div className="cards-outer">
        <div className='users-table-div'>
        <ListAdmin />
        </div>
    </div>
  );
};

export default ViewAdmin;
