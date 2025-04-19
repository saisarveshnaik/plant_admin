import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from '../utils/axiosInstance';import Endpoints from '../endpoints';

interface Achievement {
  _id?: string;
  mission_name: string;
  task_name: string;
  img:string;
  task_value: number;
  reward_type: number;
  reward_value: string;
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get(
          Endpoints.Achievements.GET,
          { headers: { token: token || '' } }
        );
        const data = Array.isArray(response.data) 
          ? response.data 
          : response.data?.data || []; // fallback if wrapped
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };
    fetchAchievements();
  }, []);

  const handleAchievementChange = (
    index: number,
    field: keyof Achievement,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    setAchievements(prevAchievements => {
      const updated = [...prevAchievements];
      updated[index] = { ...updated[index], [field]: newValue };
      return updated;
    });
  };

  const addAchievement = () => {
    setAchievements(prev => [
      ...prev,
      {
        mission_name: '',
        task_name: '',
        img: '',
        task_value: 0,
        reward_type: 0,
        reward_value: ''
      }
    ]);
  };

  const handleSave = async () => {
    try {
      for (const achievement of achievements) {
        const payload = {
          mission_name: achievement.mission_name,
          task_name: achievement.task_name,
          img: achievement.img,
          task_value: achievement.task_value,
          reward_type: achievement.reward_type,
          reward_value: achievement.reward_value,
        };
        if (achievement._id) {
          console.log("Updating achievement:", achievement);
          await axios.post(
            Endpoints.Achievements.UPDATE(achievement._id), 
            payload,
            { headers: { token: token || '' } }
          );
        } else {
          const response = await axios.post(
            Endpoints.Achievements.ADD, 
            payload,
            { headers: { token: token || '' } }
          );
          achievement._id = response.data._id;
        }
      }
      console.log("Saved achievements:", achievements);
    } catch (error) {
      console.error("Error saving achievements:", error);
    }
  };
  const handleDelete = async (index: number) => {
    const achievement = achievements[index];
    if (achievement._id) {
      try {
        await axios.delete(
          Endpoints.Achievements.DELETE(achievement._id),
          { headers: { token: token || '' } }
        );
      } catch (error) {
        console.error("Error deleting achievement:", error);
        return;
      }
    }
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Title */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Achievements</h5>
          </div>

          {/* Responsive table */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Mission Name</th>
                  <th>Task Name</th>
                  <th>Task Value</th>
                  <th>Reward Type</th>
                  <th>Reward Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((ach, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={ach.mission_name}
                        onChange={(e) => handleAchievementChange(index, 'mission_name', e)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={ach.task_name}
                        onChange={(e) => handleAchievementChange(index, 'task_name', e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={ach.task_value}
                        onChange={(e) => handleAchievementChange(index, 'task_value', e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={ach.reward_type}
                        onChange={(e) => handleAchievementChange(index, 'reward_type', e)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={ach.reward_value}
                        onChange={(e) => handleAchievementChange(index, 'reward_value', e)}
                      />
                    </td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="mt-3">
            <button className="btn btn-primary me-2" onClick={addAchievement}>
              +Achievement
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
