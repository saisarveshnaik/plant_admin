import React, { useState, ChangeEvent } from 'react';

interface DailyRewardConfig {
  day: number;
  reward: string;
  amount: string;
}

const DailyRewards: React.FC = () => {
  // Initialize 7 days by default.
  const initialDailyRewards: DailyRewardConfig[] = Array.from({ length: 7 }, (_, index) => ({
    day: index + 1,
    reward: '',
    amount: '',
  }));

  const [dailyRewards, setDailyRewards] = useState<DailyRewardConfig[]>(initialDailyRewards);

  // Handler to update the reward for a given day.
  const handleRewardChange = (dayNumber: number, event: ChangeEvent<HTMLSelectElement>) => {
    const newReward = event.target.value;
    setDailyRewards(prevRewards =>
      prevRewards.map(item =>
        item.day === dayNumber ? { ...item, reward: newReward } : item
      )
    );
  };

  // Handler to update the amount for a given day.
  const handleAmountChange = (dayNumber: number, event: ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value;
    setDailyRewards(prevRewards =>
      prevRewards.map(item =>
        item.day === dayNumber ? { ...item, amount: newAmount } : item
      )
    );
  };

  // Handler for the Save Changes button.
  const handleSaveChanges = () => {
    // Implement your save logic here (e.g., API call)
    console.log('Saving changes', dailyRewards);
  };

  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Daily Rewards</h5>
          </div>
          <h6>Daily Rewards Config</h6>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Reward</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {dailyRewards.map((item) => (
                  <tr key={item.day}>
                    <td>Day {item.day}</td>
                    <td>
                      <select
                        className="form-control"
                        value={item.reward}
                        onChange={(e) => handleRewardChange(item.day, e)}
                      >
                        <option value="">Select Reward</option>
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                        <option value="bronze">Bronze</option>
                        <option value="sunlight">Sunlight</option>
                        <option value="nutrients">Nutrients</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.amount}
                        onChange={(e) => handleAmountChange(item.day, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-primary" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRewards;
