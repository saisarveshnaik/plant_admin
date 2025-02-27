import React, { useState, ChangeEvent } from 'react';

interface Task {
  taskNo: number;
  taskName: string;
  taskAmount: string;
  points: string;
}

interface Reward {
  rewardNo: number;
  reward: string;
  points: string;
}

const DailyTasks: React.FC = () => {
  // State to track the active tab: 'config' or 'reward'
  const [activeTab, setActiveTab] = useState<'config' | 'reward'>('config');

  // Config Tab state
  const [resetTimer, setResetTimer] = useState('24 hrs');
  const [tasks, setTasks] = useState<Task[]>([
    { taskNo: 1, taskName: 'Task One', taskAmount: '10', points: '5' },
    { taskNo: 2, taskName: 'Task Two', taskAmount: '20', points: '10' },
  ]);

  // Reward Config Tab state
  const [rewards, setRewards] = useState<Reward[]>([
    { rewardNo: 1, reward: 'Gold', points: '15' },
    { rewardNo: 2, reward: 'Silver', points: '10' },
  ]);

  // Handler for the Reset Timer field.
  const handleResetTimerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setResetTimer(e.target.value);
  };

  // Handler to update task fields.
  const handleTaskChange = (index: number, field: keyof Task, e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      newTasks[index] = { ...newTasks[index], [field]: newValue };
      return newTasks;
    });
  };

  // Handler to add a new task row.
  const addTask = () => {
    setTasks(prevTasks => [
      ...prevTasks,
      { taskNo: prevTasks.length + 1, taskName: '', taskAmount: '', points: '' },
    ]);
  };

  // Handler to update reward config fields.
  const handleRewardConfigChange = (
    index: number,
    field: keyof Reward,
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    setRewards(prevRewards => {
      const newRewards = [...prevRewards];
      newRewards[index] = { ...newRewards[index], [field]: newValue };
      return newRewards;
    });
  };

  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Title */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Daily Tasks</h5>
          </div>

          {/* Tabs navigation */}
          <ul className="nav nav-tabs mb-3" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'config' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveTab('config')}
                role="tab"
                aria-selected={activeTab === 'config'}
              >
                Config Tab
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'reward' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveTab('reward')}
                role="tab"
                aria-selected={activeTab === 'reward'}
              >
                Reward Config Tab
              </button>
            </li>
          </ul>

          {/* Tab content */}
          {activeTab === 'config' && (
            <div role="tabpanel">
              {/* Reset Timer Field */}
              <div className="mb-3">
                <label className="form-label">Reset Timer</label>
                <input
                  type="text"
                  className="form-control"
                  value={resetTimer}
                  onChange={handleResetTimerChange}
                />
              </div>

              {/* Tasks Table */}
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Task no</th>
                      <th>Task Name</th>
                      <th>Task Amount</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <tr key={index}>
                        <td>{task.taskNo}</td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={task.taskName}
                            onChange={(e) => handleTaskChange(index, 'taskName', e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={task.taskAmount}
                            onChange={(e) => handleTaskChange(index, 'taskAmount', e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={task.points}
                            onChange={(e) => handleTaskChange(index, 'points', e)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* +slot Button to add a new task */}
              <button className="btn btn-primary" onClick={addTask}>
                +slot
              </button>
            </div>
          )}

          {activeTab === 'reward' && (
            <div role="tabpanel">
              {/* Rewards Table */}
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Reward No</th>
                      <th>Reward</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewards.map((reward, index) => (
                      <tr key={index}>
                        <td>{reward.rewardNo}</td>
                        <td>
                          <select
                            className="form-select"
                            value={reward.reward}
                            onChange={(e) => handleRewardConfigChange(index, 'reward', e)}
                          >
                            <option value="">Select Reward</option>
                            <option value="Gold">Gold</option>
                            <option value="Silver">Silver</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Sunlight">Sunlight</option>
                            <option value="Nutrients">Nutrients</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={reward.points}
                            onChange={(e) => handleRewardConfigChange(index, 'points', e)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
