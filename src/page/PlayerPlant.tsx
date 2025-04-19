import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from '../utils/axiosInstance';import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Endpoints from '../endpoints';

interface PlayerPlantData {
  _id: string;
  plantId: string;
  playerId: string;
  plant_stages: string;
  health: number;
  last_resouce_time: string;
  sunLight_need: number;
  water_need: number;
  nute_need: number;
}

const PlayerPlant: React.FC = () => {
  const [playerPlants, setPlayerPlants] = useState<PlayerPlantData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States to manage action button texts.
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // For inline editing.
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    plant_stages: string;
    health: number;
    last_resouce_time: string;
    sunLight_need: number;
    water_need: number;
    nute_need: number;
  }>({
    plant_stages: '',
    health: 0,
    last_resouce_time: '',
    sunLight_need: 0,
    water_need: 0,
    nute_need: 0,
  });

  // For the Add New Plant form.
  const [newPlant, setNewPlant] = useState<{
    plantId: string;
    playerId: string;
    plant_stages: string;
    health: number;
    last_resouce_time: string;
    sunLight_need: number;
    water_need: number;
    nute_need: number;
  }>({
    plantId: '',
    playerId: '',
    plant_stages: '',
    health: 0,
    last_resouce_time: '',
    sunLight_need: 0,
    water_need: 0,
    nute_need: 0,
  });

  // Get token from local storage.
  const token = localStorage.getItem('authToken');

  // Function to fetch player plant data (runs automatically on mount).
  const getPlayerPlants = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        Endpoints.PlayerPlant.GET,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        setPlayerPlants(response.data.data);
        toast.success('Player plants fetched successfully!');
      } else {
        toast.error('Failed to fetch player plants.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching player plants.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlayerPlants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changes for Add New Plant form inputs.
  const handleAddInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewPlant((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handle changes for inline update form inputs.
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Add a new player plant.
  const handleAddPlant = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(
        Endpoints.PlayerPlant.ADD,
        newPlant,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        toast.success('Player plant added successfully!');
        // Append the new record to local state.
        setPlayerPlants((prev) => [...prev, response.data.data]);
        // Reset the form.
        setNewPlant({
          plantId: '',
          playerId: '',
          plant_stages: '',
          health: 0,
          last_resouce_time: '',
          sunLight_need: 0,
          water_need: 0,
          nute_need: 0,
        });
      } else {
        toast.error('Failed to add player plant.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding player plant.');
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 1500);
    }
  };

  // Set edit mode when user clicks Update button on a record.
  const startEditing = (plant: PlayerPlantData) => {
    setEditingPlantId(plant._id);
    setEditData({
      plant_stages: plant.plant_stages,
      health: plant.health,
      last_resouce_time: plant.last_resouce_time,
      sunLight_need: plant.sunLight_need,
      water_need: plant.water_need,
      nute_need: plant.nute_need,
    });
  };

  // Cancel editing mode.
  const cancelEditing = () => {
    setEditingPlantId(null);
  };

  // Update an existing player plant.
  const handleUpdatePlant = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPlantId) return;
    setUpdatingId(editingPlantId);
    try {
      const payload = { ...editData };
      const response = await axios.post(Endpoints.PlayerPlant.UPDATE(editingPlantId), payload, { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Player plant updated successfully!');
        // Update the record in local state.
        setPlayerPlants((prev) =>
          prev.map((plant) =>
            plant._id === editingPlantId ? response.data.data : plant
          )
        );
        setEditingPlantId(null);
      } else {
        toast.error('Failed to update player plant.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating player plant.');
    } finally {
      setTimeout(() => {
        setUpdatingId(null);
      }, 1500);
    }
  };

  // Delete a player plant.
  const handleDeletePlant = async (plantId: string) => {
    setDeletingId(plantId);
    try {
      const response = await axios.delete(Endpoints.PlayerPlant.DELETE(plantId), { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Player plant deleted successfully!');
        // Remove the record from local state.
        setPlayerPlants((prev) => prev.filter((plant) => plant._id !== plantId));
      } else {
        toast.error('Failed to delete player plant.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting player plant.');
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
          <h5 className="card-title mb-4">Player Plant</h5>

          {/* Add New Plant Form */}
          <form onSubmit={handleAddPlant} className="mb-4">
            <h6>Add New Player Plant</h6>
            <div className="row g-2">
              <div className="col-md-3">
                <label htmlFor="plantId" className="form-label">Plant ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="plantId"
                  name="plantId"
                  value={newPlant.plantId}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="playerId" className="form-label">Player ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="playerId"
                  name="playerId"
                  value={newPlant.playerId}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="plant_stages" className="form-label">Plant Stage</label>
                <input
                  type="text"
                  className="form-control"
                  id="plant_stages"
                  name="plant_stages"
                  value={newPlant.plant_stages}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="health" className="form-label">Health</label>
                <input
                  type="number"
                  className="form-control"
                  id="health"
                  name="health"
                  value={newPlant.health}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
            </div>
            <div className="row g-2 mt-2">
              <div className="col-md-3">
                <label htmlFor="last_resouce_time" className="form-label">Last Resource Time</label>
                <input
                  type="text"
                  className="form-control"
                  id="last_resouce_time"
                  name="last_resouce_time"
                  value={newPlant.last_resouce_time}
                  onChange={handleAddInputChange}
                  placeholder="ISO Date string"
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="sunLight_need" className="form-label">Sunlight Need</label>
                <input
                  type="number"
                  className="form-control"
                  id="sunLight_need"
                  name="sunLight_need"
                  value={newPlant.sunLight_need}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="water_need" className="form-label">Water Need</label>
                <input
                  type="number"
                  className="form-control"
                  id="water_need"
                  name="water_need"
                  value={newPlant.water_need}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="nute_need" className="form-label">Nute Need</label>
                <input
                  type="number"
                  className="form-control"
                  id="nute_need"
                  name="nute_need"
                  value={newPlant.nute_need}
                  onChange={handleAddInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={adding}>
              {adding ? 'Adding...' : 'Add Player Plant'}
            </button>
          </form>

          {/* Display List of Player Plants */}
          {loading ? (
            <p>Loading...</p>
          ) : playerPlants.length === 0 ? (
            <p>No player plants available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Plant ID</th>
                    <th>Player ID</th>
                    <th>Stage</th>
                    <th>Health</th>
                    <th>Last Resource Time</th>
                    <th>Sunlight Need</th>
                    <th>Water Need</th>
                    <th>Nute Need</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {playerPlants.map((plant) => (
                    <tr key={plant._id}>
                      <td>{plant.plantId}</td>
                      <td>{plant.playerId}</td>
                      {editingPlantId === plant._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="plant_stages"
                              value={editData.plant_stages}
                              onChange={handleEditInputChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="health"
                              value={editData.health}
                              onChange={handleEditInputChange}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="last_resouce_time"
                              value={editData.last_resouce_time}
                              onChange={handleEditInputChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="sunLight_need"
                              value={editData.sunLight_need}
                              onChange={handleEditInputChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="water_need"
                              value={editData.water_need}
                              onChange={handleEditInputChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="nute_need"
                              value={editData.nute_need}
                              onChange={handleEditInputChange}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={handleUpdatePlant}
                              disabled={updatingId === plant._id}
                            >
                              {updatingId === plant._id ? 'Updating...' : 'Save'}
                            </button>
                            <button className="btn btn-secondary btn-sm me-2" onClick={cancelEditing}>
                              Cancel
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeletePlant(plant._id)}
                              disabled={deletingId === plant._id}
                            >
                              {deletingId === plant._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{plant.plant_stages}</td>
                          <td>{plant.health}</td>
                          <td>{plant.last_resouce_time}</td>
                          <td>{plant.sunLight_need}</td>
                          <td>{plant.water_need}</td>
                          <td>{plant.nute_need}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2 text-white"
                              onClick={() => startEditing(plant)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeletePlant(plant._id)}
                              disabled={deletingId === plant._id}
                            >
                              {deletingId === plant._id ? 'Deleting...' : 'Delete'}
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

export default PlayerPlant;
