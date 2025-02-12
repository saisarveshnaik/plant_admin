import React from 'react';
import '../styles/UserAccess.css';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ListUserAccess from '../components/ListUserAccess';

const UserAccess: React.FC = () => {
    return (
        <div className="cards-outer">
            <div className='users-table-div'>
            <ListUserAccess />
            </div>
        </div>
      );
};

export default UserAccess;
