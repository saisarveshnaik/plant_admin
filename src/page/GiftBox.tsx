import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Endpoints from '../endpoints';

interface GiftBoxData {
  _id: string;
  gift_name: string;
  collection_type: number;
  reward_collection_type: number;
  reward_type: number;
  reward_value: string;
  chance: number;
  random: boolean;
}

const GiftBox: React.FC = () => {
  const [giftBoxes, setGiftBoxes] = useState<GiftBoxData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States for handling UI feedback on action buttons.
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State for inline editing.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    gift_name: string;
    collection_type: number;
    reward_collection_type: number;
    reward_type: number;
    reward_value: string;
    chance: number;
    random: boolean;
  }>({
    gift_name: '',
    collection_type: 0,
    reward_collection_type: 0,
    reward_type: 0,
    reward_value: '',
    chance: 0,
    random: false,
  });

  // State for add new gift box form.
  const [newGift, setNewGift] = useState<{
    gift_name: string;
    collection_type: number;
    reward_collection_type: number;
    reward_type: number;
    reward_value: string;
    chance: number;
    random: boolean;
  }>({
    gift_name: '',
    collection_type: 0,
    reward_collection_type: 0,
    reward_type: 0,
    reward_value: '',
    chance: 0,
    random: false,
  });

  // Get token from local storage.
  const token = localStorage.getItem('authToken');

  // GET API: Fetch gift box data on mount.
  const getGiftBoxes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        Endpoints.GiftBox.GET,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        setGiftBoxes(response.data.data);
        toast.success('Gift boxes fetched successfully!');
      } else {
        toast.error('Failed to fetch gift boxes.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching gift boxes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGiftBoxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changes for add new gift form inputs.
  const handleAddChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewGift((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };

  // Handle changes for inline update form.
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    }));
  };

  // POST API: Add new gift box.
  const handleAddGift = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(
        Endpoints.GiftBox.ADD,
        newGift,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        toast.success('Gift box added successfully!');
        // Append new record to local state.
        setGiftBoxes((prev) => [...prev, response.data.data]);
        // Reset add form.
        setNewGift({
          gift_name: '',
          collection_type: 0,
          reward_collection_type: 0,
          reward_type: 0,
          reward_value: '',
          chance: 0,
          random: false,
        });
      } else {
        toast.error('Failed to add gift box.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding gift box.');
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 1500);
    }
  };

  // Begin editing a gift box.
  const startEditing = (gift: GiftBoxData) => {
    setEditingId(gift._id);
    setEditData({
      gift_name: gift.gift_name,
      collection_type: gift.collection_type,
      reward_collection_type: gift.reward_collection_type,
      reward_type: gift.reward_type,
      reward_value: gift.reward_value,
      chance: gift.chance,
      random: gift.random,
    });
  };

  // Cancel the inline editing mode.
  const cancelEditing = () => {
    setEditingId(null);
  };

  // POST API: Update a gift box.
  const handleUpdateGift = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUpdatingId(editingId);
    try {
      const response = await axios.post(Endpoints.GiftBox.UPDATE(editingId), editData, { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Gift box updated successfully!');
        // Update local state by replacing the updated record.
        setGiftBoxes((prev) =>
          prev.map((gift) => (gift._id === editingId ? response.data.data : gift))
        );
        setEditingId(null);
      } else {
        toast.error('Failed to update gift box.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating gift box.');
    } finally {
      setTimeout(() => {
        setUpdatingId(null);
      }, 1500);
    }
  };

  // DEL API: Delete a gift box.
  const handleDeleteGift = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(Endpoints.GiftBox.DELETE(id), { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Gift box deleted successfully!');
        // Remove deleted record from local state.
        setGiftBoxes((prev) => prev.filter((gift) => gift._id !== id));
      } else {
        toast.error('Failed to delete gift box.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting gift box.');
    } finally {
      setTimeout(() => {
        setDeletingId(null);
      }, 1500);
    }
  };

  return (
    <div className="cards-outer">
      <ToastContainer />
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Gift Box</h5>

          {/* Add New Gift Box Form */}
          <form onSubmit={handleAddGift} className="mb-4">
            <h6>Add New Gift Box</h6>
            <div className="row g-2">
              <div className="col-md-3">
                <label htmlFor="gift_name" className="form-label">Gift Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="gift_name"
                  name="gift_name"
                  value={newGift.gift_name}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="collection_type" className="form-label">Collection Type</label>
                <input
                  type="number"
                  className="form-control"
                  id="collection_type"
                  name="collection_type"
                  value={newGift.collection_type}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="reward_collection_type" className="form-label">Reward Collection Type</label>
                <input
                  type="number"
                  className="form-control"
                  id="reward_collection_type"
                  name="reward_collection_type"
                  value={newGift.reward_collection_type}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="reward_type" className="form-label">Reward Type</label>
                <input
                  type="number"
                  className="form-control"
                  id="reward_type"
                  name="reward_type"
                  value={newGift.reward_type}
                  onChange={handleAddChange}
                  required
                />
              </div>
            </div>
            <div className="row g-2 mt-2">
              <div className="col-md-3">
                <label htmlFor="reward_value" className="form-label">Reward Value</label>
                <input
                  type="text"
                  className="form-control"
                  id="reward_value"
                  name="reward_value"
                  value={newGift.reward_value}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="chance" className="form-label">Chance</label>
                <input
                  type="number"
                  className="form-control"
                  id="chance"
                  name="chance"
                  value={newGift.chance}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-3 d-flex align-items-center mt-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="random"
                    name="random"
                    checked={newGift.random}
                    onChange={handleAddChange}
                  />
                  <label htmlFor="random" className="form-check-label">Random</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={adding}>
              {adding ? 'Adding...' : 'Add Gift Box'}
            </button>
          </form>

          {/* Gift Box List */}
          {loading ? (
            <p>Loading...</p>
          ) : giftBoxes.length === 0 ? (
            <p>No gift boxes available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Gift Name</th>
                    <th>Collection Type</th>
                    <th>Reward Collection Type</th>
                    <th>Reward Type</th>
                    <th>Reward Value</th>
                    <th>Chance</th>
                    <th>Random</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {giftBoxes.map((gift) => (
                    <tr key={gift._id}>
                      {editingId === gift._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="gift_name"
                              value={editData.gift_name}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="collection_type"
                              value={editData.collection_type}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="reward_collection_type"
                              value={editData.reward_collection_type}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="reward_type"
                              value={editData.reward_type}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="reward_value"
                              value={editData.reward_value}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="chance"
                              value={editData.chance}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="random"
                              checked={editData.random}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={handleUpdateGift}
                              disabled={updatingId === gift._id}
                            >
                              {updatingId === gift._id ? 'Updating...' : 'Save'}
                            </button>
                            <button className="btn btn-secondary btn-sm me-2" onClick={cancelEditing}>
                              Cancel
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteGift(gift._id)}
                              disabled={deletingId === gift._id}
                            >
                              {deletingId === gift._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{gift.gift_name}</td>
                          <td>{gift.collection_type}</td>
                          <td>{gift.reward_collection_type}</td>
                          <td>{gift.reward_type}</td>
                          <td>{gift.reward_value}</td>
                          <td>{gift.chance}</td>
                          <td>{gift.random ? 'Yes' : 'No'}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2 text-white"
                              onClick={() => startEditing(gift)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteGift(gift._id)}
                              disabled={deletingId === gift._id}
                            >
                              {deletingId === gift._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftBox;
