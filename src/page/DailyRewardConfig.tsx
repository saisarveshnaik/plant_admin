import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DailyReward {
  _id?: string;
  day_No: number;
  reward_type: number;
  reward_value: string;
  img: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE = 'http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/daily-reward';

const DailyRewards: React.FC = () => {

    const tok = localStorage.getItem('authToken');
  
    // If the token is not present, redirect to /login
    if (!tok) {
      return <Navigate to="/login" replace />;
    }

  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([]);
  const [newReward, setNewReward] = useState<DailyReward>({
    day_No: 1,
    reward_type: 0,
    reward_value: '',
    img: '',
  });
  const [editReward, setEditReward] = useState<{ [key: string]: DailyReward }>({});

  // Loading states for buttons:
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = localStorage.getItem('authToken') || '';

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  };

  // Fetch rewards from API.
  const fetchDailyRewards = async () => {
    try {
      const response = await axios.get(`${API_BASE}/get-daily-reward`, axiosConfig);
      if (response.data.status) {
        setDailyRewards(response.data.data);
      } else {
        console.error('Failed to fetch daily rewards:', response.data.message);
        toast.error(`Fetch Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error fetching daily rewards:', error);
      toast.error('Error fetching daily rewards');
    }
  };

  useEffect(() => {
    fetchDailyRewards();
    // eslint-disable-next-line
  }, []);

  const handleNewRewardChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReward(prev => ({
      ...prev,
      [name]: (name === 'day_No' || name === 'reward_type') ? Number(value) : value,
    }));
  };

  const handleAddReward = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(`${API_BASE}/add-daily-reward`, newReward, axiosConfig);
      if (response.data.status) {
        setDailyRewards(prev => [...prev, response.data.data]);
        setNewReward({ day_No: 1, reward_type: 0, reward_value: '', img: '' });
        toast.success('Reward added successfully');
      } else {
        console.error('Failed to add reward:', response.data.message);
        toast.error(`Add Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error adding reward:', error);
      toast.error('Error adding reward');
    }
    // Keep the "Adding Reward..." text visible for 1.5 sec before reverting.
    setTimeout(() => setAdding(false), 1500);
  };

  const handleEditChange = (id: string, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const currentItem = dailyRewards.find(item => item._id === id);
    if (!currentItem) return;
    setEditReward(prev => ({
      ...prev,
      [id]: {
        _id: currentItem._id, // preserve the _id
        ...currentItem,
        ...prev[id],
        [name]: (name === 'day_No' || name === 'reward_type') ? Number(value) : value,
      },
    }));
  };

  // Update reward using POST (as required).
  const handleUpdateReward = async (reward: DailyReward) => {
    if (!reward._id) {
      console.error('Reward id is missing.');
      return;
    }
    setUpdatingId(reward._id);
    const payload = {
      day_No: Number(reward.day_No),
      reward_type: Number(reward.reward_type),
      reward_value: reward.reward_value,
      img: reward.img,
    };

    try {
      const response = await axios.post(`${API_BASE}/update-daily-reward/${reward._id}`, payload, axiosConfig);
      if (response.data.status) {
        setDailyRewards(prev =>
          prev.map(item => (item._id === reward._id ? response.data.data : item))
        );
        setEditReward(prev => {
          const updated = { ...prev };
          delete updated[reward._id!];
          return updated;
        });
        toast.success('Reward updated successfully');
      } else {
        console.error('Failed to update reward:', response.data.message);
        toast.error(`Update Error: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error updating reward:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
      toast.error('Error updating reward');
    }
    setTimeout(() => setUpdatingId(null), 1500);
  };

  const handleDeleteReward = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(`${API_BASE}/delete-daily-reward/${id}`, axiosConfig);
      if (response.data.status) {
        setDailyRewards(prev => prev.filter(item => item._id !== id));
        toast.success('Reward deleted successfully');
      } else {
        console.error('Failed to delete reward:', response.data.message);
        toast.error(`Delete Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Error deleting reward');
    }
    setTimeout(() => setDeletingId(null), 1500);
  };

  return (
    <div className="cards-outer">
      <ToastContainer />
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Daily Rewards</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Reward Value</th>
                  <th>Reward Type</th>
                  <th>Image</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dailyRewards.map(item => {
                  const editData = item._id && editReward[item._id] ? editReward[item._id] : item;
                  return (
                    <tr key={item._id || item.day_No}>
                      <td>
                        <input
                          type="number"
                          name="day_No"
                          value={editData.day_No ?? ''}
                          onChange={e => item._id && handleEditChange(item._id, e)}
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="reward_value"
                          value={editData.reward_value ?? ''}
                          onChange={e => item._id && handleEditChange(item._id, e)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="reward_type"
                          value={editData.reward_type ?? ''}
                          onChange={e => item._id && handleEditChange(item._id, e)}
                          style={{ width: '60px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="img"
                          value={editData.img ?? ''}
                          onChange={e => item._id && handleEditChange(item._id, e)}
                        />
                      </td>
                      <td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                      <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleString() : '-'}</td>
                      <td>
                        {item._id && (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleUpdateReward(editData)}
                              disabled={updatingId === item._id}
                            >
                              {updatingId === item._id ? 'Updating...' : 'Update'}
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteReward(item._id!)}
                              disabled={deletingId === item._id}
                            >
                              {deletingId === item._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <h6 className="mt-4">Add New Daily Reward</h6>
          <form onSubmit={handleAddReward}>
            <div className="row g-2 align-items-center">
              <div className="col-auto">
                <label>Day:</label>
                <input
                  type="number"
                  name="day_No"
                  className="form-control"
                  value={newReward.day_No}
                  onChange={handleNewRewardChange}
                  style={{ width: '80px' }}
                />
              </div>
              <div className="col-auto">
                <label>Reward Value:</label>
                <input
                  type="text"
                  name="reward_value"
                  className="form-control"
                  value={newReward.reward_value}
                  onChange={handleNewRewardChange}
                />
              </div>
              <div className="col-auto">
                <label>Reward Type:</label>
                <input
                  type="number"
                  name="reward_type"
                  className="form-control"
                  value={newReward.reward_type}
                  onChange={handleNewRewardChange}
                  style={{ width: '80px' }}
                />
              </div>
              <div className="col-auto">
                <label>Image:</label>
                <input
                  type="text"
                  name="img"
                  className="form-control"
                  value={newReward.img}
                  onChange={handleNewRewardChange}
                />
              </div>
              <div className="col-auto mt-4">
                <button type="submit" className="btn btn-primary" disabled={adding}>
                  {adding ? 'Adding Reward...' : 'Add Reward'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DailyRewards;
