import React, { useState, ChangeEvent } from 'react';

interface SpinSlot {
  slot: number;
  reward: string;
  amount: string;
  probability: number;
}

/**
 * Generates an array of random probabilities (with two decimal places)
 * for a given number of slots that sum up to the specified total.
 */
const generateRandomProbabilities = (numSlots: number, total: number = 100): number[] => {
  const randoms = Array.from({ length: numSlots }, () => Math.random());
  const totalRandom = randoms.reduce((acc, value) => acc + value, 0);
  const probs: number[] = [];
  let sum = 0;
  for (let i = 0; i < numSlots - 1; i++) {
    const prob = parseFloat(((randoms[i] / totalRandom) * total).toFixed(2));
    probs.push(prob);
    sum += prob;
  }
  const lastProb = parseFloat((total - sum).toFixed(2));
  probs.push(lastProb);
  return probs;
};

const SpinWheel: React.FC = () => {
  // Top row configuration state.
  const [spinTimer, setSpinTimer] = useState('');
  const [currency, setCurrency] = useState('Gold');
  const [baseValue, setBaseValue] = useState('');
  const [multiplierValue, setMultiplierValue] = useState('');

  // Initialize with 8 slots, assigning equal probabilities (deterministic on refresh).
  const initialNumSlots = 8;
  const equalProbability = parseFloat((100 / initialNumSlots).toFixed(2));
  const initialProbabilities = Array.from({ length: initialNumSlots }, () => equalProbability);

  const initialSlots: SpinSlot[] = Array.from({ length: initialNumSlots }, (_, index) => ({
    slot: index + 1,
    reward: '',
    amount: '',
    probability: initialProbabilities[index],
  }));

  const [slots, setSlots] = useState<SpinSlot[]>(initialSlots);

  // Top row field handlers.
  const handleSpinTimerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSpinTimer(e.target.value);
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleBaseValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBaseValue(e.target.value);
  };

  const handleMultiplierValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMultiplierValue(e.target.value);
  };

  // Handlers for the Reward and Amount fields.
  const handleRewardChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newReward = e.target.value;
    setSlots(prevSlots => {
      const updated = [...prevSlots];
      updated[index].reward = newReward;
      return updated;
    });
  };

  const handleAmountChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setSlots(prevSlots => {
      const updated = [...prevSlots];
      updated[index].amount = newAmount;
      return updated;
    });
  };

  /**
   * When the admin enters a probability value in one slot,
   * that slot’s probability is fixed and the remaining slots are assigned
   * random probabilities that sum up to (100 - fixed value).
   */
  const handleProbabilityChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
      return; // Optionally handle invalid input
    }
    const fixedProbability = parsedValue;
    const numSlots = slots.length;
    const numOtherSlots = numSlots - 1;
    let newSlots = [...slots];
    newSlots[index].probability = fixedProbability;
    if (numOtherSlots > 0) {
      const remainingTotal = parseFloat((100 - fixedProbability).toFixed(2));
      const randomProbs = generateRandomProbabilities(numOtherSlots, remainingTotal);
      let counter = 0;
      newSlots = newSlots.map((slot, idx) => {
        if (idx === index) return slot;
        return { ...slot, probability: randomProbs[counter++] };
      });
    }
    setSlots(newSlots);
  };

  // Handler to add a new slot. When added, probabilities are recalculated.
  const addSlot = () => {
    setSlots(prevSlots => {
      const newSlotNumber = prevSlots.length + 1;
      const newSlot: SpinSlot = {
        slot: newSlotNumber,
        reward: '',
        amount: '',
        probability: 0, // temporary; will be recalculated below
      };
      const updatedSlots = [...prevSlots, newSlot];
      
      // If any slot was previously manually fixed (i.e. not equal), recalc based on that.
      const fixedIndex = updatedSlots.findIndex(
        (slot) => slot.probability !== parseFloat((100 / prevSlots.length).toFixed(2))
      );
      if (fixedIndex !== -1) {
        const fixedProbability = updatedSlots[fixedIndex].probability;
        const numOtherSlots = updatedSlots.length - 1;
        const remainingTotal = parseFloat((100 - fixedProbability).toFixed(2));
        const randomProbs = generateRandomProbabilities(numOtherSlots, remainingTotal);
        let counter = 0;
        return updatedSlots.map((slot, idx) => {
          if (idx === fixedIndex) return slot;
          return { ...slot, probability: randomProbs[counter++] };
        });
      } else {
        // If no slot was manually fixed, distribute equally.
        const newEqual = parseFloat((100 / updatedSlots.length).toFixed(2));
        return updatedSlots.map(slot => ({ ...slot, probability: newEqual }));
      }
    });
  };

  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Spin Wheel</h5>
          
          {/* Top configuration row */}
          <div className="mb-4">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Spin Timer</label>
                  <input
                    type="text"
                    className="form-control"
                    value={spinTimer}
                    onChange={handleSpinTimerChange}
                    placeholder="Enter spin timer"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    className="form-control"
                    value={currency}
                    onChange={handleCurrencyChange}
                  >
                    <option value="Gold">Gold</option>
                    <option value="Resource">Resource</option>
                    <option value="currency">currency</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Base Value</label>
                  <input
                    type="text"
                    className="form-control"
                    value={baseValue}
                    onChange={handleBaseValueChange}
                    placeholder="Enter base value"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Multiplier Value</label>
                  <input
                    type="text"
                    className="form-control"
                    value={multiplierValue}
                    onChange={handleMultiplierValueChange}
                    placeholder="Enter multiplier value"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Slots table */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Slot</th>
                  <th>Reward</th>
                  <th>Amount</th>
                  <th>Probability (%)</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slotItem, index) => (
                  <tr key={index}>
                    <td>Slot {slotItem.slot}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={slotItem.reward}
                        onChange={(e) => handleRewardChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={slotItem.amount}
                        onChange={(e) => handleAmountChange(index, e)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={slotItem.probability}
                        onChange={(e) => handleProbabilityChange(index, e)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Button to add a new slot */}
          <button className="btn btn-primary" onClick={addSlot}>
            Add Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
