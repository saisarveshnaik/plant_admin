import React, { useState, ChangeEvent } from 'react';

interface RankConfig {
  rank: number;
  xpRequired: number;
  rankRewards: string;
}

const ProgressionConfig: React.FC = () => {
  // Initialize 30 ranks by default.
  const initialRanks: RankConfig[] = Array.from({ length: 30 }, (_, index) => ({
    rank: index + 1,
    xpRequired: 1000 * (index + 1), // Example XP value; adjust as needed.
    rankRewards: '',
  }));

  const [ranks, setRanks] = useState<RankConfig[]>(initialRanks);

  // Handler to update the XP required value for a given rank.
  const handleXpChange = (rankNumber: number, event: ChangeEvent<HTMLInputElement>) => {
    const newXp = Number(event.target.value);
    setRanks(prevRanks =>
      prevRanks.map(r =>
        r.rank === rankNumber ? { ...r, xpRequired: newXp } : r
      )
    );
  };

  // Handler to update the rank rewards for a given rank.
  const handleRewardsChange = (rankNumber: number, event: ChangeEvent<HTMLInputElement>) => {
    const newRewards = event.target.value;
    setRanks(prevRanks =>
      prevRanks.map(r =>
        r.rank === rankNumber ? { ...r, rankRewards: newRewards } : r
      )
    );
  };

  // Handler to add a new rank.
  const addRank = () => {
    const newRankNumber = ranks.length + 1;
    const newRank: RankConfig = {
      rank: newRankNumber,
      xpRequired: 1000 * newRankNumber, // Default XP value; adjust if necessary.
      rankRewards: '',
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
                  <th>Rank Rewards</th>
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
                      <input
                        type="text"
                        className="form-control"
                        value={rankItem.rankRewards}
                        onChange={(e) => handleRewardsChange(rankItem.rank, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary" onClick={addRank}>
            Add Rank
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressionConfig;
