import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FreeAdData {
  _id: string;
  free_reward_img: string;
  free_ad_reward_type: number;
  free_ad_reward_value: string;
}

const FreeAdRewards: React.FC = () => {
  const [freeAds, setFreeAds] = useState<FreeAdData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States for action button texts.
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State for inline editing mode.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    free_reward_img: string;
    free_ad_reward_type: number;
    free_ad_reward_value: string;
  }>({
    free_reward_img: '',
    free_ad_reward_type: 0,
    free_ad_reward_value: '',
  });

  // State for add new free ad form.
  const [newFreeAd, setNewFreeAd] = useState<{
    free_reward_img: string;
    free_ad_reward_type: number;
    free_ad_reward_value: string;
  }>({
    free_reward_img: '',
    free_ad_reward_type: 0,
    free_ad_reward_value: '',
  });

  // Get token from local storage.
  const token = localStorage.getItem('authToken');

  // Ref to avoid multiple API calls on mount (e.g., with React StrictMode).
  const didMountRef = useRef(false);

  // GET API: Fetch free ad rewards on mount.
  const getFreeAds = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/free-ad/get-free-ad',
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        setFreeAds(response.data.data);
        toast.success('Free ad rewards fetched successfully!');
      } else {
        toast.error('Failed to fetch free ad rewards.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching free ad rewards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didMountRef.current) {
      getFreeAds();
      didMountRef.current = true;
    }
  }, []);

  // Handle changes for the add new free ad form.
  const handleAddChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewFreeAd((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handle changes for the inline update form.
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // POST API: Add a new free ad reward.
  const handleAddFreeAd = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(
        'http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/free-ad/add-free-ad',
        newFreeAd,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        toast.success('Free ad reward added successfully!');
        // Append the new record to local state.
        setFreeAds((prev) => [...prev, response.data.data]);
        // Reset add form.
        setNewFreeAd({ free_reward_img: '', free_ad_reward_type: 0, free_ad_reward_value: '' });
      } else {
        toast.error('Failed to add free ad reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding free ad reward.');
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 1500);
    }
  };

  // Set a free ad reward into edit mode.
  const startEditing = (freeAd: FreeAdData) => {
    setEditingId(freeAd._id);
    setEditData({
      free_reward_img: freeAd.free_reward_img,
      free_ad_reward_type: freeAd.free_ad_reward_type,
      free_ad_reward_value: freeAd.free_ad_reward_value,
    });
  };

  // Cancel inline editing.
  const cancelEditing = () => {
    setEditingId(null);
  };

  // POST API: Update a free ad reward.
  const handleUpdateFreeAd = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUpdatingId(editingId);
    try {
      const updateUrl = `http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/free-ad/update-free-ad/${editingId}`;
      const response = await axios.post(updateUrl, editData, { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Free ad reward updated successfully!');
        // Update local state by replacing the updated record.
        setFreeAds((prev) =>
          prev.map((ad) => (ad._id === editingId ? response.data.data : ad))
        );
        setEditingId(null);
      } else {
        toast.error('Failed to update free ad reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating free ad reward.');
    } finally {
      setTimeout(() => {
        setUpdatingId(null);
      }, 1500);
    }
  };

  // DEL API: Delete a free ad reward.
  const handleDeleteFreeAd = async (id: string) => {
    setDeletingId(id);
    try {
      const deleteUrl = `http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/free-ad/delete-free-ad/${id}`;
      const response = await axios.delete(deleteUrl, { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Free ad reward deleted successfully!');
        // Remove the record from local state.
        setFreeAds((prev) => prev.filter((ad) => ad._id !== id));
      } else {
        toast.error('Failed to delete free ad reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting free ad reward.');
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
          <h5 className="card-title mb-4">Free Ad Rewards</h5>

          {/* Add New Free Ad Reward Form */}
          <form onSubmit={handleAddFreeAd} className="mb-4">
            <h6>Add New Free Ad Reward</h6>
            <div className="row g-2">
              <div className="col-md-4">
                <label htmlFor="free_reward_img" className="form-label">Reward Image</label>
                <input
                  type="text"
                  className="form-control"
                  id="free_reward_img"
                  name="free_reward_img"
                  value={newFreeAd.free_reward_img}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="free_ad_reward_type" className="form-label">Reward Type</label>
                <input
                  type="number"
                  className="form-control"
                  id="free_ad_reward_type"
                  name="free_ad_reward_type"
                  value={newFreeAd.free_ad_reward_type}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="free_ad_reward_value" className="form-label">Reward Value</label>
                <input
                  type="text"
                  className="form-control"
                  id="free_ad_reward_value"
                  name="free_ad_reward_value"
                  value={newFreeAd.free_ad_reward_value}
                  onChange={handleAddChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={adding}>
              {adding ? 'Adding...' : 'Add Free Ad Reward'}
            </button>
          </form>

          {/* Display List of Free Ad Rewards */}
          {loading ? (
            <p>Loading...</p>
          ) : freeAds.length === 0 ? (
            <p>No free ad rewards available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Reward Image</th>
                    <th>Reward Type</th>
                    <th>Reward Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {freeAds.map((ad) => (
                    <tr key={ad._id}>
                      {editingId === ad._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="free_reward_img"
                              value={editData.free_reward_img}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="free_ad_reward_type"
                              value={editData.free_ad_reward_type}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="free_ad_reward_value"
                              value={editData.free_ad_reward_value}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={handleUpdateFreeAd}
                              disabled={updatingId === ad._id}
                            >
                              {updatingId === ad._id ? 'Updating...' : 'Save'}
                            </button>
                            <button className="btn btn-secondary btn-sm me-2" onClick={cancelEditing}>
                              Cancel
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteFreeAd(ad._id)}
                              disabled={deletingId === ad._id}
                            >
                              {deletingId === ad._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{ad.free_reward_img}</td>
                          <td>{ad.free_ad_reward_type}</td>
                          <td>{ad.free_ad_reward_value}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2 text-white"
                              onClick={() => startEditing(ad)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteFreeAd(ad._id)}
                              disabled={deletingId === ad._id}
                            >
                              {deletingId === ad._id ? 'Deleting...' : 'Delete'}
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

export default FreeAdRewards;
