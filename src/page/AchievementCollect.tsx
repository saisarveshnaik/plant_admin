import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Endpoints from '../endpoints';

interface AchievementCollectData {
  _id: string;
  playerId: string;
  achievementId: string;
  achievement_count: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

const AchievementCollect: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementCollectData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Retrieve the token from local storage.
  const token = localStorage.getItem('authToken');

  // Function to fetch achievement collect data.
  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        Endpoints.AchievementCollect.GET,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        setAchievements(response.data.data);
        toast.success('Achievements collected successfully!');
      } else {
        toast.error('Failed to fetch achievements.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching achievements.');
    } finally {
      setLoading(false);
    }
  };

  // Call the API once on mount.
  useEffect(() => {
    fetchAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cards-outer">
      <ToastContainer />
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Achievement Collect</h5>
          {loading ? (
            <p>Loading achievements...</p>
          ) : achievements.length === 0 ? (
            <p>No achievements found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Player ID</th>
                    <th>Achievement ID</th>
                    <th>Achievement Count</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((item) => (
                    <tr key={item._id}>
                      <td>{item.id}</td>
                      <td>{item.playerId}</td>
                      <td>{item.achievementId}</td>
                      <td>{item.achievement_count}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>{new Date(item.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCollect;
