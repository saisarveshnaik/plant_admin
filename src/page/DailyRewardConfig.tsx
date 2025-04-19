import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Endpoints from '../endpoints';

interface DailyReward {
  _id?: string;
  day_No: number;
  reward_type: number;
  reward_value: string;
  img: string;
  createdAt?: string;
  updatedAt?: string;
}

const DailyRewards: React.FC = () => {
  const [dailyRewards, setDailyRewards] = useState<DailyReward[]>([]);
  const [newReward, setNewReward] = useState<DailyReward>({
    day_No: 1,
    reward_type: 0,
    reward_value: '',
    img: '',
  });
  const [editReward, setEditReward] = useState<{ [key: string]: DailyReward }>({});
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const token = localStorage.getItem('authToken') || '';

  useEffect(() => {
    if (!token) {
      setRedirectToLogin(true);
      return;
    }

    const fetchDailyRewards = async () => {
      try {
        const response = await axios.get(Endpoints.DailyRewards.GET, {
          headers: {
            'Content-Type': 'application/json',
            token,
          },
        });
        if (response.data.status) {
          setDailyRewards(response.data.data);
        } else {
          toast.error(`Fetch Error: ${response.data.message}`);
        }
      } catch (error) {
        toast.error('Error fetching daily rewards');
      }
    };

    fetchDailyRewards();
  }, [token]);

  if (redirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      token,
    },
  };

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
      const response = await axios.post(Endpoints.DailyRewards.ADD, newReward, axiosConfig);
      if (response.data.status) {
        setDailyRewards(prev => [...prev, response.data.data]);
        setNewReward({ day_No: 1, reward_type: 0, reward_value: '', img: '' });
        toast.success('Reward added successfully');
      } else {
        toast.error(`Add Error: ${response.data.message}`);
      }
    } catch (error) {
      toast.error('Error adding reward');
    }
    setTimeout(() => setAdding(false), 1500);
  };

  const handleEditChange = (id: string, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const currentItem = dailyRewards.find(item => item._id === id);
    if (!currentItem) return;
    setEditReward(prev => ({
      ...prev,
      [id]: {
        ...currentItem,
        ...prev[id],
        [name]: (name === 'day_No' || name === 'reward_type') ? Number(value) : value,
      },
    }));
  };

  const handleUpdateReward = async (reward: DailyReward) => {
    if (!reward._id) return;

    setUpdatingId(reward._id);

    const payload = {
      day_No: reward.day_No,
      reward_type: reward.reward_type,
      reward_value: reward.reward_value,
      img: reward.img,
    };

    try {
      const response = await axios.post(Endpoints.DailyRewards.UPDATE(reward._id), payload, axiosConfig);
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
        toast.error(`Update Error: ${response.data.message}`);
      }
    } catch (error) {
      toast.error('Error updating reward');
    }

    setTimeout(() => setUpdatingId(null), 1500);
  };

  const handleDeleteReward = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(Endpoints.DailyRewards.DELETE(id), axiosConfig);
      if (response.data.status) {
        setDailyRewards(prev => prev.filter(item => item._id !== id));
        toast.success('Reward deleted successfully');
      } else {
        toast.error(`Delete Error: ${response.data.message}`);
      }
    } catch (error) {
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
