// Sidebar.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Sidebar.css';
import { FaChartLine, FaCogs, FaEnvelope, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface SidebarProps {
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout }) => {
  const [themeOpen, setThemeOpen] = useState(true);
  const [componentsOpen, setComponentsOpen] = useState(true);

  const toggleSection = (section: string) => {
    if (section === 'theme') {
      setThemeOpen(!themeOpen);
    } else if (section === 'components') {
      setComponentsOpen(!componentsOpen);
    }
  };

  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout();
    navigate('/login'); // Redirect to login page
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
            <FaChartLine className="sidebar-icon" /> Dashboard
          </li>
        </Link>
      </ul>


      {/* Components Section with Collapsible */}
      {/* <h6 onClick={() => toggleSection('components')} className="sidebar-toggle">
        ADD/VIEW/DELETE BLOGS {componentsOpen ? <FaChevronUp /> : <FaChevronDown />}
      </h6>
      {componentsOpen && (
        <ul className="list-unstyled">
          <Link to="/add-big-blog">
            <li className="sidebar-item mb-3">
              <FaCogs className="sidebar-icon" /> Add Big Blog
            </li>
          </Link>
          <Link to="/view-blogs">
            <li className="sidebar-item mb-3">
              <FaCogs className="sidebar-icon" /> View/Delete Blogs
            </li>
          </Link>
        </ul>
      )} */}

      <ul className="list-unstyled">
      <Link to="/add-big-blog">
            <li className="sidebar-item mb-3">
              <FaCogs className="sidebar-icon" /> Add Big Blog
            </li>
          </Link>
          <Link to="/view-blogs">
            <li className="sidebar-item mb-3">
              <FaCogs className="sidebar-icon" /> View/Delete Blogs
            </li>
          </Link>
      <Link to="/view-forms">
            <li className="sidebar-item mb-3">
              <FaCogs className="sidebar-icon" /> View/Delete Forms
            </li>
          </Link>
      <li className="sidebar-item mb-3" onClick={onLogoutClick}>
            <FaCogs className="sidebar-icon" /> Logout
          </li>
      </ul>

      <div className="sidebarfooter">
        <h6 className="smart">Gaming Panda Studios</h6>
      </div>
    </div>
  );
};

export default Sidebar;
