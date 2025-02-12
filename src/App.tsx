// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import InfoCard from './components/InfoCard';
import LoginPage from './page/LoginPage';
import AddAdmin from './page/AddAdmin';
import ViewAdmin from './page/ViewAdmin';
import ViewUsers from './page/ViewUsers';
import UserAccess from './page/UserAccess';
import TransactionDetails from './page/TransactionDetails';
import ProgressionConfig from './page/ProgressionConfig';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <Routes>
        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Other Pages */}
        <Route
          path="*"
          element={
            <div className="app-container d-flex">
              {/* Sidebar */}
              <div className={`sidebar ${isSidebarOpen ? '' : 'sidebar-hidden'}`}>
                <Sidebar />
              </div>

              {/* Main content area */}
              <div className={`main-content d-flex flex-column ${isSidebarOpen ? 'content-with-sidebar' : 'content-full'}`}>
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Content */}
                <div className="content-area flex-grow-1">
                  <Routes>
                    <Route path="/" element={<><div className="info-cards"><InfoCard /></div></>}/>
                    <Route path="/add-admin" element={<AddAdmin />} />
                    <Route path="/view-admin" element={<ViewAdmin />} />
                    <Route path="/view-users" element={<ViewUsers />} />
                    <Route path="/user-access" element={<UserAccess />} />
                    <Route path="/transaction-details" element={<TransactionDetails />} />
                    <Route path="/progression-config" element={<ProgressionConfig />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
