import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaChartLine, FaCogs, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [themeOpen, setThemeOpen] = useState(false); // Dropdown state for theme
  const [componentsOpen, setComponentsOpen] = useState(false); // Dropdown state for components
  const [settingsOpen, setSettingsOpen] = useState(false); // Dropdown state for settings

  const toggleSection = (section: string) => {
    if (section === 'theme') {
      setThemeOpen(!themeOpen);
    } else if (section === 'components') {
      setComponentsOpen(!componentsOpen);
    }
    else if (section === 'settings') {
      setSettingsOpen(!settingsOpen);
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
              <Link to="/user-access">
              <li className="sidebar-item"> User Access</li>
              </Link>
            </ul>
          )}
        </li> 

                         {/* Dropdown for Settings */}
                         <li className="sidebar-item mb-3 dropdown" onClick={() => toggleSection('settings')}>
          <div className="d-flex align-items-center">
            <FaCogs className="sidebar-icon" /> Settings
            {settingsOpen ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
          </div>
          {settingsOpen && (
            <ul className="list-unstyled pl-3 sidebar-dropdown">
              <Link to="/game-version" >
              <li className="sidebar-item">Game Version</li>
              </Link>
              <Link to="/game-settings" >
              <li className="sidebar-item">Game Settings</li>
              </Link>
            </ul>
          )}
        </li> 

        <Link to="/view-users">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />User Details
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

        <Link to="/daily-rewards-config">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Daily Rewards Config
          </li>
        </Link>

        <Link to="/spinwheel">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Spin Wheel
          </li>
        </Link>



        <li className="sidebar-item mb-3 dropdown" onClick={() => toggleSection('components')}>
          <div className="d-flex align-items-center">
            <FaCogs className="sidebar-icon" /> Task/Mission
            {componentsOpen ? <FaAngleUp className="ml-2" /> : <FaAngleDown className="ml-2" />}
          </div>
          {componentsOpen && (
            <ul className="list-unstyled pl-3 sidebar-dropdown">
              <Link to="/daily-tasks"><li className="sidebar-item">Daily Tasks</li></Link>
              <Link to="/achievements"><li className="sidebar-item">Achievements</li></Link>
            </ul>
          )}
        </li>

        <Link to="/plant-config">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Plant Config
          </li>
        </Link>

        <Link to="/offer-config">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Offer Config
          </li>
        </Link>

        <Link to="/puzzle-config">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Puzzle Config
          </li>
        </Link>

        <Link to="/player-plant">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Player Plant
          </li>
        </Link>

        <Link to="/gift-box">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Gift Box
          </li>
        </Link>

        <Link to="/free-ad-rewards">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Free Ad Rewards
          </li>
        </Link>

        <Link to="/social-rewards">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Social Rewards
          </li>
        </Link>

        <Link to="/level-complete-rewards">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Level Complete Rewards
          </li>
        </Link>

        <Link to="/in-app-purchase">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />In App Purchase
          </li>
        </Link>

        <Link to="/in-app-purchase-history">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />In App Purchase History
          </li>
        </Link>

        <Link to="/achievement-collect">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Achievement Collect
          </li>
        </Link>

        <Link to="/logout">
          <li className="sidebar-item mb-3">
            <FaCogs className="sidebar-icon" />Logout
          </li>
        </Link>

      </ul>


      <img src='plant.png' className='plant' />
      

      <div className="sidebarfooter">
      <h6 className="smart">&copy; 2025 Gaming Panda Studios. All rights reserved.</h6>
      </div>
      
     

    </div>
  );
};

export default Sidebar;
