import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Endpoints from '../endpoints';

interface LevelData {
  _id: string;
  level: number;
  star_2_First_collect: number;
  star_3_First_collect: number;
  star_3_Second_collect: number;
  exp_3_star_first_collect: number;
  exp_2_star_first_collect: number;
  exp_3_star_second_collect: number;
  leaderboard_3_star_first_collect: number;
  leaderboard_2_star_first_collect: number;
  leaderboard_3_star_second_collect: number;
  exp_3_star_first_combo_multi_collect: number;
  exp_2_star_first_combo_multi_collect: number;
  exp_3_star_second_combo_multi_collect: number;
  leaderboard_3_star_first_combo_multi_collect: number;
  leaderboard_2_star_first_combo_multi_collect: number;
  leaderboard_3_star_second_combo_multi_collect: number;
}

const LevelCompleteRewards: React.FC = () => {
  const [levels, setLevels] = useState<LevelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Action states for temporary button text changes.
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // For inline editing.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Omit<LevelData, '_id'>>({
    level: 0,
    star_2_First_collect: 0,
    star_3_First_collect: 0,
    star_3_Second_collect: 0,
    exp_3_star_first_collect: 0,
    exp_2_star_first_collect: 0,
    exp_3_star_second_collect: 0,
    leaderboard_3_star_first_collect: 0,
    leaderboard_2_star_first_collect: 0,
    leaderboard_3_star_second_collect: 0,
    exp_3_star_first_combo_multi_collect: 0,
    exp_2_star_first_combo_multi_collect: 0,
    exp_3_star_second_combo_multi_collect: 0,
    leaderboard_3_star_first_combo_multi_collect: 0,
    leaderboard_2_star_first_combo_multi_collect: 0,
    leaderboard_3_star_second_combo_multi_collect: 0,
  });

  // For adding a new record.
  const [newLevel, setNewLevel] = useState<Omit<LevelData, '_id'>>({
    level: 0,
    star_2_First_collect: 0,
    star_3_First_collect: 0,
    star_3_Second_collect: 0,
    exp_3_star_first_collect: 0,
    exp_2_star_first_collect: 0,
    exp_3_star_second_collect: 0,
    leaderboard_3_star_first_collect: 0,
    leaderboard_2_star_first_collect: 0,
    leaderboard_3_star_second_collect: 0,
    exp_3_star_first_combo_multi_collect: 0,
    exp_2_star_first_combo_multi_collect: 0,
    exp_3_star_second_combo_multi_collect: 0,
    leaderboard_3_star_first_combo_multi_collect: 0,
    leaderboard_2_star_first_combo_multi_collect: 0,
    leaderboard_3_star_second_combo_multi_collect: 0,
  });

  // Token from local storage.
  const token = localStorage.getItem('authToken');

  // Prevent duplicate GET calls on mount.
  const didMountRef = useRef(false);

  // GET API: Retrieve level rewards. Runs once on mount.
  const getLevels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        Endpoints.LevelCompleteRewards.GET,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        setLevels(response.data.data);
        toast.success('Level rewards fetched successfully!');
      } else {
        toast.error('Failed to fetch level rewards.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching level rewards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didMountRef.current) {
      getLevels();
      didMountRef.current = true;
    }
  }, []);

  // Handle change for add form inputs.
  const handleNewChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewLevel((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handle change for inline edit form inputs.
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // POST API: Add new level reward.
  const handleAddLevel = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(
        Endpoints.LevelCompleteRewards.ADD,
        newLevel,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        toast.success('Level reward added successfully!');
        // Append the new level record to local state.
        setLevels((prev) => [...prev, response.data.data]);
        // Reset add form.
        setNewLevel({
          level: 0,
          star_2_First_collect: 0,
          star_3_First_collect: 0,
          star_3_Second_collect: 0,
          exp_3_star_first_collect: 0,
          exp_2_star_first_collect: 0,
          exp_3_star_second_collect: 0,
          leaderboard_3_star_first_collect: 0,
          leaderboard_2_star_first_collect: 0,
          leaderboard_3_star_second_collect: 0,
          exp_3_star_first_combo_multi_collect: 0,
          exp_2_star_first_combo_multi_collect: 0,
          exp_3_star_second_combo_multi_collect: 0,
          leaderboard_3_star_first_combo_multi_collect: 0,
          leaderboard_2_star_first_combo_multi_collect: 0,
          leaderboard_3_star_second_combo_multi_collect: 0,
        });
      } else {
        toast.error('Failed to add level reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding level reward.');
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 1500);
    }
  };

  // Start inline editing.
  const startEditing = (level: LevelData) => {
    setEditingId(level._id);
    setEditData({
      level: level.level,
      star_2_First_collect: level.star_2_First_collect,
      star_3_First_collect: level.star_3_First_collect,
      star_3_Second_collect: level.star_3_Second_collect,
      exp_3_star_first_collect: level.exp_3_star_first_collect,
      exp_2_star_first_collect: level.exp_2_star_first_collect,
      exp_3_star_second_collect: level.exp_3_star_second_collect,
      leaderboard_3_star_first_collect: level.leaderboard_3_star_first_collect,
      leaderboard_2_star_first_collect: level.leaderboard_2_star_first_collect,
      leaderboard_3_star_second_collect: level.leaderboard_3_star_second_collect,
      exp_3_star_first_combo_multi_collect: level.exp_3_star_first_combo_multi_collect,
      exp_2_star_first_combo_multi_collect: level.exp_2_star_first_combo_multi_collect,
      exp_3_star_second_combo_multi_collect: level.exp_3_star_second_combo_multi_collect,
      leaderboard_3_star_first_combo_multi_collect: level.leaderboard_3_star_first_combo_multi_collect,
      leaderboard_2_star_first_combo_multi_collect: level.leaderboard_2_star_first_combo_multi_collect,
      leaderboard_3_star_second_combo_multi_collect: level.leaderboard_3_star_second_combo_multi_collect,
    });
  };

  // Cancel inline editing.
  const cancelEditing = () => {
    setEditingId(null);
  };

  // POST API: Update level reward.
  const handleUpdateLevel = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUpdatingId(editingId);
    try {
      const response = await axios.post(Endpoints.LevelCompleteRewards.UPDATE(editingId), editData, { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Level reward updated successfully!');
        // Update the record locally.
        setLevels((prev) =>
          prev.map((lvl) => (lvl._id === editingId ? response.data.data : lvl))
        );
        setEditingId(null);
      } else {
        toast.error('Failed to update level reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating level reward.');
    } finally {
      setTimeout(() => {
        setUpdatingId(null);
      }, 1500);
    }
  };

  // DEL API: Delete a level reward.
  const handleDeleteLevel = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await axios.delete(Endpoints.LevelCompleteRewards.DELETE(id), { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Level reward deleted successfully!');
        // Remove the record from local state.
        setLevels((prev) => prev.filter((lvl) => lvl._id !== id));
      } else {
        toast.error('Failed to delete level reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting level reward.');
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
          <h5 className="card-title mb-4">Level Complete Rewards</h5>

          {/* Add New Level Form */}
          <form onSubmit={handleAddLevel} className="mb-4">
            <h6>Add New Level Reward</h6>
            <div className="row g-2">
              <div className="col-md-2">
                <label htmlFor="level" className="form-label">
                  Level
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="level"
                  name="level"
                  value={newLevel.level}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="star_2_First_collect" className="form-label">
                  Star 2 (First)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="star_2_First_collect"
                  name="star_2_First_collect"
                  value={newLevel.star_2_First_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="star_3_First_collect" className="form-label">
                  Star 3 (First)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="star_3_First_collect"
                  name="star_3_First_collect"
                  value={newLevel.star_3_First_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="star_3_Second_collect" className="form-label">
                  Star 3 (Second)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="star_3_Second_collect"
                  name="star_3_Second_collect"
                  value={newLevel.star_3_Second_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="exp_3_star_first_collect" className="form-label">
                  Exp 3 Star First
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exp_3_star_first_collect"
                  name="exp_3_star_first_collect"
                  value={newLevel.exp_3_star_first_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="exp_2_star_first_collect" className="form-label">
                  Exp 2 Star First
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exp_2_star_first_collect"
                  name="exp_2_star_first_collect"
                  value={newLevel.exp_2_star_first_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
            </div>
            {/* Second row of fields */}
            <div className="row g-2 mt-2">
              <div className="col-md-2">
                <label htmlFor="exp_3_star_second_collect" className="form-label">
                  Exp 3 Star Second
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exp_3_star_second_collect"
                  name="exp_3_star_second_collect"
                  value={newLevel.exp_3_star_second_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="leaderboard_3_star_first_collect" className="form-label">
                  LB 3 Star First
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="leaderboard_3_star_first_collect"
                  name="leaderboard_3_star_first_collect"
                  value={newLevel.leaderboard_3_star_first_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="leaderboard_2_star_first_collect" className="form-label">
                  LB 2 Star First
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="leaderboard_2_star_first_collect"
                  name="leaderboard_2_star_first_collect"
                  value={newLevel.leaderboard_2_star_first_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="leaderboard_3_star_second_collect" className="form-label">
                  LB 3 Star Second
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="leaderboard_3_star_second_collect"
                  name="leaderboard_3_star_second_collect"
                  value={newLevel.leaderboard_3_star_second_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="exp_3_star_first_combo_multi_collect" className="form-label">
                  Exp 3 Star First Combo
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exp_3_star_first_combo_multi_collect"
                  name="exp_3_star_first_combo_multi_collect"
                  value={newLevel.exp_3_star_first_combo_multi_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="exp_2_star_first_combo_multi_collect" className="form-label">
                  Exp 2 Star First Combo
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exp_2_star_first_combo_multi_collect"
                  name="exp_2_star_first_combo_multi_collect"
                  value={newLevel.exp_2_star_first_combo_multi_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
            </div>
            {/* Third row of fields */}
            <div className="row g-2 mt-2">
              <div className="col-md-2">
                <label htmlFor="exp_3_star_second_combo_multi_collect" className="form-label">
                  Exp 3 Star Second Combo
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exp_3_star_second_combo_multi_collect"
                  name="exp_3_star_second_combo_multi_collect"
                  value={newLevel.exp_3_star_second_combo_multi_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="leaderboard_3_star_first_combo_multi_collect" className="form-label">
                  LB 3 Star First Combo
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="leaderboard_3_star_first_combo_multi_collect"
                  name="leaderboard_3_star_first_combo_multi_collect"
                  value={newLevel.leaderboard_3_star_first_combo_multi_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="leaderboard_2_star_first_combo_multi_collect" className="form-label">
                  LB 2 Star First Combo
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="leaderboard_2_star_first_combo_multi_collect"
                  name="leaderboard_2_star_first_combo_multi_collect"
                  value={newLevel.leaderboard_2_star_first_combo_multi_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="leaderboard_3_star_second_combo_multi_collect" className="form-label">
                  LB 3 Star Second Combo
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="leaderboard_3_star_second_combo_multi_collect"
                  name="leaderboard_3_star_second_combo_multi_collect"
                  value={newLevel.leaderboard_3_star_second_combo_multi_collect}
                  onChange={handleNewChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={adding}>
              {adding ? 'Adding...' : 'Add Level Reward'}
            </button>
          </form>

          {/* Display the list of level rewards */}
          {loading ? (
            <p>Loading...</p>
          ) : levels.length === 0 ? (
            <p>No level rewards available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Level</th>
                    <th>Star 2 First</th>
                    <th>Star 3 First</th>
                    <th>Star 3 Second</th>
                    <th>Exp 3 Star First</th>
                    <th>Exp 2 Star First</th>
                    <th>Exp 3 Star Second</th>
                    <th>LB 3 Star First</th>
                    <th>LB 2 Star First</th>
                    <th>LB 3 Star Second</th>
                    <th>Exp 3 Star First Combo</th>
                    <th>Exp 2 Star First Combo</th>
                    <th>Exp 3 Star Second Combo</th>
                    <th>LB 3 Star First Combo</th>
                    <th>LB 2 Star First Combo</th>
                    <th>LB 3 Star Second Combo</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((lvl) => (
                    <tr key={lvl._id}>
                      {editingId === lvl._id ? (
                        <>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="level"
                              value={editData.level}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="star_2_First_collect"
                              value={editData.star_2_First_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="star_3_First_collect"
                              value={editData.star_3_First_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="star_3_Second_collect"
                              value={editData.star_3_Second_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="exp_3_star_first_collect"
                              value={editData.exp_3_star_first_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="exp_2_star_first_collect"
                              value={editData.exp_2_star_first_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="exp_3_star_second_collect"
                              value={editData.exp_3_star_second_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="leaderboard_3_star_first_collect"
                              value={editData.leaderboard_3_star_first_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="leaderboard_2_star_first_collect"
                              value={editData.leaderboard_2_star_first_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="leaderboard_3_star_second_collect"
                              value={editData.leaderboard_3_star_second_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="exp_3_star_first_combo_multi_collect"
                              value={editData.exp_3_star_first_combo_multi_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="exp_2_star_first_combo_multi_collect"
                              value={editData.exp_2_star_first_combo_multi_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="exp_3_star_second_combo_multi_collect"
                              value={editData.exp_3_star_second_combo_multi_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="leaderboard_3_star_first_combo_multi_collect"
                              value={editData.leaderboard_3_star_first_combo_multi_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="leaderboard_2_star_first_combo_multi_collect"
                              value={editData.leaderboard_2_star_first_combo_multi_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="leaderboard_3_star_second_combo_multi_collect"
                              value={editData.leaderboard_3_star_second_combo_multi_collect}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={handleUpdateLevel}
                              disabled={updatingId === lvl._id}
                            >
                              {updatingId === lvl._id ? 'Updating...' : 'Save'}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm me-2"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteLevel(lvl._id)}
                              disabled={deletingId === lvl._id}
                            >
                              {deletingId === lvl._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{lvl.level}</td>
                          <td>{lvl.star_2_First_collect}</td>
                          <td>{lvl.star_3_First_collect}</td>
                          <td>{lvl.star_3_Second_collect}</td>
                          <td>{lvl.exp_3_star_first_collect}</td>
                          <td>{lvl.exp_2_star_first_collect}</td>
                          <td>{lvl.exp_3_star_second_collect}</td>
                          <td>{lvl.leaderboard_3_star_first_collect}</td>
                          <td>{lvl.leaderboard_2_star_first_collect}</td>
                          <td>{lvl.leaderboard_3_star_second_collect}</td>
                          <td>{lvl.exp_3_star_first_combo_multi_collect}</td>
                          <td>{lvl.exp_2_star_first_combo_multi_collect}</td>
                          <td>{lvl.exp_3_star_second_combo_multi_collect}</td>
                          <td>{lvl.leaderboard_3_star_first_combo_multi_collect}</td>
                          <td>{lvl.leaderboard_2_star_first_combo_multi_collect}</td>
                          <td>{lvl.leaderboard_3_star_second_combo_multi_collect}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2 text-white"
                              onClick={() => startEditing(lvl)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteLevel(lvl._id)}
                              disabled={deletingId === lvl._id}
                            >
                              {deletingId === lvl._id ? 'Deleting...' : 'Delete'}
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

export default LevelCompleteRewards;
