import React, { useState, ChangeEvent } from 'react';

interface RankConfig {
  rank: number;
  xpRequired: number;
  rewardItem: string;
  amount: string;
}

const ProgressionConfig: React.FC = () => {
  // Initialize 30 ranks by default.
  const initialRanks: RankConfig[] = Array.from({ length: 30 }, (_, index) => ({
    rank: index + 1,
    xpRequired: 1000 * (index + 1), // Example XP value; adjust as needed.
    rewardItem: '',
    amount: '',
  }));

  const [ranks, setRanks] = useState<RankConfig[]>(initialRanks);

  // Ranks that should have Reward Items and Amount inputs.
  const eligibleRanks = [5, 10, 15, 20, 25, 28, 30];

  // Handler to update the XP required value for a given rank.
  const handleXpChange = (rankNumber: number, event: ChangeEvent<HTMLInputElement>) => {
    const newXp = Number(event.target.value);
    setRanks(prevRanks =>
      prevRanks.map(r =>
        r.rank === rankNumber ? { ...r, xpRequired: newXp } : r
      )
    );
  };

  // Handler to update the reward item for a given rank.
  const handleRewardItemChange = (rankNumber: number, event: ChangeEvent<HTMLSelectElement>) => {
    const newRewardItem = event.target.value;
    setRanks(prevRanks =>
      prevRanks.map(r =>
        r.rank === rankNumber ? { ...r, rewardItem: newRewardItem } : r
      )
    );
  };

  // Handler to update the amount for a given rank.
  const handleAmountChange = (rankNumber: number, event: ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value;
    setRanks(prevRanks =>
      prevRanks.map(r =>
        r.rank === rankNumber ? { ...r, amount: newAmount } : r
      )
    );
  };

  // Handler to add a new rank.
  const addRank = () => {
    const newRankNumber = ranks.length + 1;
    const newRank: RankConfig = {
      rank: newRankNumber,
      xpRequired: 1000 * newRankNumber, // Default XP value; adjust if necessary.
      rewardItem: '',
      amount: '',
    };
    setRanks(prevRanks => [...prevRanks, newRank]);
  };

  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Progression Config</h5>
          <h6>Player Rank Progression Config</h6>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>XP Required</th>
                  <th>Reward Items</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ranks.map((rankItem) => (
                  <tr key={rankItem.rank}>
                    <td>{rankItem.rank}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={rankItem.xpRequired}
                        onChange={(e) => handleXpChange(rankItem.rank, e)}
                      />
                    </td>
                    <td>
                      {eligibleRanks.includes(rankItem.rank) ? (
                        <select
                          className="form-control form-select"
                          value={rankItem.rewardItem}
                          onChange={(e) => handleRewardItemChange(rankItem.rank, e)}
                        >
                          <option value="">Select Reward</option>
                          <option value="gold">gold</option>
                          <option value="silver">silver</option>
                          <option value="bronze">bronze</option>
                          <option value="sunlight">sunlight</option>
                          <option value="water">water</option>
                          <option value="nutrients">nutrients</option>
                        </select>
                      ) : null}
                    </td>
                    <td>
                      {eligibleRanks.includes(rankItem.rank) ? (
                        <input
                          type="number"
                          className="form-control"
                          value={rankItem.amount}
                          onChange={(e) => handleAmountChange(rankItem.rank, e)}
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary" onClick={addRank}>
            Add Rank
          </button>
          <button className="btn btn-primary mt-2" >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressionConfig;
