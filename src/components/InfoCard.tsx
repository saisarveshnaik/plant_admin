import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Last24hrUsers from './Last24hrUsers';
import CountUp from './CountUp';
import '../styles/InfoCard.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from '../utils/axiosInstance';import Endpoints from '../endpoints';

// Register the necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Daily Users Chart Component
const DailyUsersGraph: React.FC = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Users',
        data: [1200, 1900, 3000, 5000, 2300, 3400, 2900],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Daily Users' },
    },
    scales: {
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        title: { display: true, text: 'Users' },
      },
    },
  };

  return (
    <div
      className="daily-users-graph"
      style={{
        width: '100%',
        height: '400px',
        backgroundColor: '#fff',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

// Revenue Chart Component
const DailyRevenueGraph: React.FC = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [200, 450, 300, 700, 500, 600, 400],
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Daily Revenue' },
    },
    scales: {
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        title: { display: true, text: 'Revenue' },
      },
    },
  };

  return (
    <div
      className="daily-revenue-graph"
      style={{
        width: '100%',
        height: '400px',
        backgroundColor: '#fff',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

const InfoCard: React.FC = () => {
  
  const token = localStorage.getItem('authToken');
  const [dashboardData, setDashboardData] = useState({ totalUsers: 0, totalRevenue: 0, dailyActiveUser: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(Endpoints.Dashboard.GET,
          { headers: { token: token || '' } }
        ); // replace with actual endpoint
        if (res.data?.status) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard info', err);
      }
    };

    fetchDashboardData();
  }, []);

  // If the token is not present, redirect to /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="cards-outer">
      <div className="row mt-4">
        {/* Card 1 */}
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
              <img src="icons/user.png" className="icon" alt="User Icon" />
              <h5 className="card-title">
                <CountUp endNumber={dashboardData.totalUsers} duration={1000} />
              </h5>
              <p className="card-text">TOTAL USERS</p>
              <Link to="/view-users">
                <button className="btn btn-primary">VIEW TOTAL USERS</button>
              </Link>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
              <img src="icons/user.png" className="icon" alt="User Icon" />
              <h5 className="card-title">
                <CountUp endNumber={dashboardData.dailyActiveUser} duration={1000} />
              </h5>
              <p className="card-text">Daily Active Users</p>
              <Link to="">
                <button className="btn btn-primary">VIEW ACTIVE USERS</button>
              </Link>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
              <img src="icons/downloads.png" className="icon" alt="Downloads Icon" />
              <h5 className="card-title">
                <CountUp endNumber={dashboardData.totalRevenue} duration={1000} />
              </h5>
              <p className="card-text">TOTAL REVENUE</p>
              <Link to="">
                <button className="btn btn-primary">VIEW INFO</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Users & Revenue Graph Section */}
      {/* <div className="graph-section mt-4">
        <div className="row">
          <div className="col-md-6">
            <DailyUsersGraph />
          </div>
          <div className="col-md-6">
            <DailyRevenueGraph />
          </div>
        </div>
      </div> */}

      {/* Last 24hr Users Table */}
      <div className="users-table-div mt-4">
        <Last24hrUsers />
      </div>
    </div>
  );
};

export default InfoCard;
