import React, { useState, ChangeEvent } from 'react';

interface Achievement {
  achievementNo: number;
  achievementName: string;
  count: string;
  reward: string;
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    { achievementNo: 1, achievementName: 'First Achievement', count: '1', reward: 'Gold' }
  ]);

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
      { achievementNo: prev.length + 1, achievementName: '', count: '', reward: '' }
    ]);
  };

  const handleSave = () => {
    // Implement save logic here
    console.log('Saved achievements:', achievements);
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
                  <th>Achievement no</th>
                  <th>Achievement name</th>
                  <th>Count</th>
                  <th>Reward</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((ach, index) => (
                  <tr key={index}>
                    <td>{ach.achievementNo}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={ach.achievementName}
                        onChange={(e) => handleAchievementChange(index, 'achievementName', e)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={ach.count}
                        onChange={(e) => handleAchievementChange(index, 'count', e)}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={ach.reward}
                        onChange={(e) => handleAchievementChange(index, 'reward', e)}
                      >
                        <option value="">Select Reward</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Bronze">Bronze</option>
                        <option value="Sunlight">Sunlight</option>
                        <option value="Nutrients">Nutrients</option>
                      </select>
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
