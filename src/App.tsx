// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import InfoCard from './components/InfoCard';
import Table from './components/Table';
import AddBigBlog from './page/AddBigBlog';
import LoginPage from './page/LoginPage';
import ViewBlogs from './page/ViewBlogs';
import ViewForms from './page/ViewForms';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Check authentication status
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear authentication token
    setIsAuthenticated(false); // Update authentication state
  };

  return (
    <Router>
      <div className="app-container d-flex">
        {!isAuthenticated ? (
          // Render LoginPage if not authenticated
          <LoginPage setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <>
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? '' : 'sidebar-hidden'}`}>
              <Sidebar handleLogout={handleLogout} /> {/* Pass handleLogout as prop */}
            </div>

            {/* Main content area */}
            <div className={`main-content d-flex flex-column ${isSidebarOpen ? 'content-with-sidebar' : 'content-full'}`}>
              {/* Navbar */}
              <Navbar toggleSidebar={toggleSidebar} />

              {/* Content */}
              <div className="content-area flex-grow-1">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <div className="info-cards">
                          <InfoCard />
                        </div>
                      </>
                    }
                  />
                  <Route path="/add-big-blog" element={<AddBigBlog />} />
                  <Route path="/view-blogs" element={<ViewBlogs />} />
                  <Route path="/view-forms" element={<ViewForms />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
