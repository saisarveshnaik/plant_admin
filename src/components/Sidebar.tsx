import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaChartLine, FaCogs, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [themeOpen, setThemeOpen] = useState(false); // Dropdown state for theme
  const [componentsOpen, setComponentsOpen] = useState(false); // Dropdown state for components

  const toggleSection = (section: string) => {
    if (section === 'theme') {
      setThemeOpen(!themeOpen);
    } else if (section === 'components') {
      setComponentsOpen(!componentsOpen);
    }
  };

  return (
    <div className="sidebar d-flex flex-column p-3">
      {/* Placeholder Logo */}
      <div className="sidebar-logo">
        <img
          src="https://i.ibb.co/xjq14Xd/footer-logo.png"
          alt="Logo"
          className="logo-img"
        />
      </div>

      <ul className="list-unstyled">
        <Link to="/">
          <li className="sidebar-item mb-3">
            <FaChartLine className="sidebar-icon" /> DASHBOARD
          </li>
        </Link>

                 {/* Dropdown for Theme */}
        <li className="sidebar-item mb-3 dropdown" onClick={() => toggleSection('theme')}>
          <div className="d-flex align-items-center">
            <FaCogs className="sidebar-icon" /> Admin Roles
            {themeOpen ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
          </div>
          {themeOpen && (
            <ul className="list-unstyled pl-3 sidebar-dropdown">
              <Link to="/add-admin" >
              <li className="sidebar-item">Add Admin</li>
              </Link>
              <Link to="/view-admin" >
              <li className="sidebar-item">View/Delete Admin</li>
              </Link>
            </ul>
          )}
        </li> 

        <Link to="/view-users">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />User Details
          </li>
        </Link>

        <Link to="/user-access">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />User Access
          </li>
        </Link>

        <Link to="/transaction-details">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Transaction Details
          </li>
        </Link>

        <Link to="/progression-config">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Progression Config
          </li>
        </Link>



        {/* <li className="sidebar-item mb-3 dropdown" onClick={() => toggleSection('components')}>
          <div className="d-flex align-items-center">
            <FaCogs className="sidebar-icon" /> Components
            {componentsOpen ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
          </div>
          {componentsOpen && (
            <ul className="list-unstyled pl-3 sidebar-dropdown">
              <li className="sidebar-item">Button</li>
              <li className="sidebar-item">Modal</li>
            </ul>
          )}
        </li> */}

      </ul>


      <img src='plant.png' className='plant' />
      

      <div className="sidebarfooter">
      <h6 className="smart">&copy; 2025 Gaming Panda Studios. All rights reserved.</h6>
      </div>
      
     

    </div>
  );
};

export default Sidebar;
