import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from '../utils/axiosInstance';
import Endpoints from '../endpoints';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SpinSlot {
  id: string;
  spin_part: number;
  reward_type: number;
  reward_value: string;
  chance: number;
}

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
  const initialNumSlots = 8;
  const equalProbability = parseFloat((100 / initialNumSlots).toFixed(2));
  const initialProbabilities = Array.from({ length: initialNumSlots }, () => equalProbability);

  const [slots, setSlots] = useState<SpinSlot[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const handleRewardChange = (index: number, field: 'reward_type' | 'reward_value', value: string) => {
    setSlots(prevSlots => {
      const updated = [...prevSlots];
      updated[index] = {
        ...updated[index],
        [field]: field === 'reward_type' ? Number(value) : value
      };
      return updated;
    });
  };

  const token = localStorage.getItem('authToken');
  const handleProbabilityChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const parsedValue = parseFloat(inputValue);
    if (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100) {
      return;
    }
    const fixedProbability = parsedValue;
    const numSlots = slots.length;
    const numOtherSlots = numSlots - 1;
    let newSlots = [...slots];
    newSlots[index].chance = fixedProbability;
    if (numOtherSlots > 0) {
      const remainingTotal = parseFloat((100 - fixedProbability).toFixed(2));
      const randomProbs = generateRandomProbabilities(numOtherSlots, remainingTotal);
      let counter = 0;
      newSlots = newSlots.map((slot, idx) => {
        if (idx === index) return slot;
        return { ...slot, chance: randomProbs[counter++] };
      });
    }
    setSlots(newSlots);
  };

  const addSlot = () => {
    setSlots(prevSlots => {
      const newSlotNumber = prevSlots.length + 1;
      const newSlot: SpinSlot = {
        id: '',
        spin_part: newSlotNumber,
        reward_type: 0,
        reward_value: '',
        chance: 0,
      };
      const updatedSlots = [...prevSlots, newSlot];
      
      const fixedIndex = updatedSlots.findIndex(
        (slot) => slot.chance !== parseFloat((100 / prevSlots.length).toFixed(2))
      );
      setEditingIndex(fixedIndex+1);
      if (fixedIndex !== -1) {
        const fixedProbability = updatedSlots[fixedIndex].chance;
        const numOtherSlots = updatedSlots.length - 1;
        const remainingTotal = parseFloat((100 - fixedProbability).toFixed(2));
        const randomProbs = generateRandomProbabilities(numOtherSlots, remainingTotal);
        let counter = 0;  
        return updatedSlots.map((slot, idx) => {
          if (idx === fixedIndex) return slot;
          return { ...slot, chance: randomProbs[counter++] };
        });
      } else {
        const newEqual = parseFloat((100 / updatedSlots.length).toFixed(2));
        return updatedSlots.map(slot => ({ ...slot, chance: newEqual }));
      }
    });
  };

  const deleteSlot = async (index: number) => {
    const slotToDelete = slots[index];
    try {
      if(slotToDelete.id) {
      await axios.delete(Endpoints.SpinWheel.DELETE(slotToDelete.id), {
        headers: { token: token || '' },
      });

      toast.success('Spin wheel deleted successfully!');
    }
      setSlots((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to delete slot:', error);

      toast.error('Spin wheel failed to delete!');
    }
  };


  useEffect(() => {
    // Fetch spin wheel data
    const fetchSpinWheel = async () => {
      // Assume fetch logic here
      const res = await axios.get(
        Endpoints.SpinWheel.GET,
        { headers: { token: token || '' } }
      ); // Example API call
      const data = res.data?.data;
      if (data) {
        const fetchedSlots = data.map((slot: any) => ({
          id: slot.id,
          spin_part: slot.spin_part,
          reward_type: slot.reward_type,
          reward_value: slot.reward_value,
          chance: slot.chance
        }));
        setSlots(fetchedSlots);
      }
    };
    fetchSpinWheel();
  }, []);

  const saveSingleSlot = async (index: number) => {
    const slot = slots[index];
    const payload = {
        spin_part: slot.spin_part,
        reward_type: slot.reward_type,
        reward_value: slot.reward_value,
        chance: slot.chance,
    };
    try {
      if(slot.id) {
      await axios.post(Endpoints.SpinWheel.UPDATE(slot.id), payload, {
        headers: { token: token || '' },
      });
      toast.success('Slot updated successfully.');
      setEditingIndex(null);
    } else {
      await axios.post(Endpoints.SpinWheel.ADD, payload, {
        headers: { token: token || '' },
      });
      toast.success('Spin wheel added successfully.');
      setEditingIndex(null);
    }
    } catch (error) {
      console.error('Failed to update slot:', error);

      toast.error('Spin wheel failed to update.');
    }
  };

  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Spin Wheel</h5>

          {/* Slots table */}
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Spin Part</th>
                  <th>Reward Type</th>
                  <th>Reward Value</th>
                  <th>Chance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slotItem, index) => (
                  <tr key={index}>
                    <td>{slotItem.spin_part}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={slotItem.reward_type}
                        disabled={editingIndex !== index}
                        onChange={(e) => handleRewardChange(index, 'reward_type', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={slotItem.reward_value}
                        disabled={editingIndex !== index}
                        onChange={(e) => handleRewardChange(index, 'reward_value', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={slotItem.chance}
                        disabled={editingIndex !== index}
                        onChange={(e) => handleProbabilityChange(index, e)}
                      />
                    </td>
                    <td>
                    {editingIndex === index ? (
                        <button className="btn btn-success btn-sm me-2" onClick={() => saveSingleSlot(index)}>
                          Save
                        </button>
                      ) : (
                        <button className="btn btn-success btn-sm me-2" onClick={() => setEditingIndex(index)}>
                          Edit
                        </button>
                      )}
                      <button className="btn btn-danger btn-sm" onClick={() => deleteSlot(index)}>
                        Delete
                      </button>
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SpinWheel;
