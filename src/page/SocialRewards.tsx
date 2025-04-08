import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface SocialData {
  _id: string;
  google_connect_reward_type: number;
  google_connect_reward_value: string;
  facebook_connect_reward_type: number;
  facebook_connect_reward_value: string;
  apple_connect_reward_type: number;
  apple_connect_reward_value: string;
}

const SocialRewards: React.FC = () => {
  const [socials, setSocials] = useState<SocialData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States to show temporary button texts during actions.
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State for inline editing.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    google_connect_reward_type: number;
    google_connect_reward_value: string;
    facebook_connect_reward_type: number;
    facebook_connect_reward_value: string;
    apple_connect_reward_type: number;
    apple_connect_reward_value: string;
  }>({
    google_connect_reward_type: 0,
    google_connect_reward_value: '',
    facebook_connect_reward_type: 0,
    facebook_connect_reward_value: '',
    apple_connect_reward_type: 0,
    apple_connect_reward_value: '',
  });

  // State for adding a new Social record.
  const [newSocial, setNewSocial] = useState<{
    google_connect_reward_type: number;
    google_connect_reward_value: string;
    facebook_connect_reward_type: number;
    facebook_connect_reward_value: string;
    apple_connect_reward_type: number;
    apple_connect_reward_value: string;
  }>({
    google_connect_reward_type: 0,
    google_connect_reward_value: '',
    facebook_connect_reward_type: 0,
    facebook_connect_reward_value: '',
    apple_connect_reward_type: 0,
    apple_connect_reward_value: '',
  });

  // Get token from local storage.
  const token = localStorage.getItem('authToken');

  // Use a ref to avoid duplicate GET calls in development (e.g., React StrictMode).
  const didMountRef = useRef(false);

  // GET API: Fetch social rewards on mount.
  const getSocials = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/social/get-social',
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        setSocials(response.data.data);
        toast.success('Social rewards fetched successfully!');
      } else {
        toast.error('Failed to fetch social rewards.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching social rewards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didMountRef.current) {
      getSocials();
      didMountRef.current = true;
    }
  }, []);

  // Handle changes for the add form.
  const handleAddChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewSocial((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handle changes for the inline edit form.
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // POST API: Add a new Social reward.
  const handleAddSocial = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(
        'http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/social/add-social',
        newSocial,
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        toast.success('Social reward added successfully!');
        // Update the local state by appending the new record.
        setSocials((prev) => [...prev, response.data.data]);
        // Reset add form.
        setNewSocial({
          google_connect_reward_type: 0,
          google_connect_reward_value: '',
          facebook_connect_reward_type: 0,
          facebook_connect_reward_value: '',
          apple_connect_reward_type: 0,
          apple_connect_reward_value: '',
        });
      } else {
        toast.error('Failed to add social reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding social reward.');
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 1500);
    }
  };

  // Enter inline editing mode.
  const startEditing = (social: SocialData) => {
    setEditingId(social._id);
    setEditData({
      google_connect_reward_type: social.google_connect_reward_type,
      google_connect_reward_value: social.google_connect_reward_value,
      facebook_connect_reward_type: social.facebook_connect_reward_type,
      facebook_connect_reward_value: social.facebook_connect_reward_value,
      apple_connect_reward_type: social.apple_connect_reward_type,
      apple_connect_reward_value: social.apple_connect_reward_value,
    });
  };

  // Cancel editing mode.
  const cancelEditing = () => {
    setEditingId(null);
  };

  // POST API: Update a Social reward.
  const handleUpdateSocial = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUpdatingId(editingId);
    try {
      const updateUrl = `http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/social/update-social/${editingId}`;
      const response = await axios.post(updateUrl, editData, { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Social reward updated successfully!');
        // Update local state by replacing the record with the updated one.
        setSocials((prev) =>
          prev.map((social) =>
            social._id === editingId ? response.data.data : social
          )
        );
        setEditingId(null);
      } else {
        toast.error('Failed to update social reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating social reward.');
    } finally {
      setTimeout(() => {
        setUpdatingId(null);
      }, 1500);
    }
  };

  // DEL API: Delete a Social reward.
  const handleDeleteSocial = async (id: string) => {
    setDeletingId(id);
    try {
      const deleteUrl = `http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/social/delete-social/${id}`;
      const response = await axios.delete(deleteUrl, { headers: { token: token || '' } });
      if (response.data.status) {
        toast.success('Social reward deleted successfully!');
        // Remove the record from local state.
        setSocials((prev) => prev.filter((social) => social._id !== id));
      } else {
        toast.error('Failed to delete social reward.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting social reward.');
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
          <h5 className="card-title mb-4">Social Rewards</h5>

          {/* Form to Add New Social Reward */}
          <form onSubmit={handleAddSocial} className="mb-4">
            <h6>Add New Social Reward</h6>
            <div className="row g-2">
              <div className="col-md-4">
                <label htmlFor="google_connect_reward_value" className="form-label">Google Reward Value</label>
                <input
                  type="text"
                  className="form-control"
                  id="google_connect_reward_value"
                  name="google_connect_reward_value"
                  value={newSocial.google_connect_reward_value}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="google_connect_reward_type" className="form-label">Google Reward Type</label>
                <input
                  type="number"
                  className="form-control"
                  id="google_connect_reward_type"
                  name="google_connect_reward_type"
                  value={newSocial.google_connect_reward_type}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="facebook_connect_reward_value" className="form-label">Facebook Reward Value</label>
                <input
                  type="text"
                  className="form-control"
                  id="facebook_connect_reward_value"
                  name="facebook_connect_reward_value"
                  value={newSocial.facebook_connect_reward_value}
                  onChange={handleAddChange}
                  required
                />
              </div>
            </div>
            <div className="row g-2 mt-2">
              <div className="col-md-4">
                <label htmlFor="facebook_connect_reward_type" className="form-label">Facebook Reward Type</label>
                <input
                  type="number"
                  className="form-control"
                  id="facebook_connect_reward_type"
                  name="facebook_connect_reward_type"
                  value={newSocial.facebook_connect_reward_type}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="apple_connect_reward_value" className="form-label">Apple Reward Value</label>
                <input
                  type="text"
                  className="form-control"
                  id="apple_connect_reward_value"
                  name="apple_connect_reward_value"
                  value={newSocial.apple_connect_reward_value}
                  onChange={handleAddChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="apple_connect_reward_type" className="form-label">Apple Reward Type</label>
                <input
                  type="number"
                  className="form-control"
                  id="apple_connect_reward_type"
                  name="apple_connect_reward_type"
                  value={newSocial.apple_connect_reward_type}
                  onChange={handleAddChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={adding}>
              {adding ? 'Adding...' : 'Add Social Reward'}
            </button>
          </form>

          {/* Display List of Social Rewards */}
          {loading ? (
            <p>Loading...</p>
          ) : socials.length === 0 ? (
            <p>No social rewards available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Google Reward Type</th>
                    <th>Google Reward Value</th>
                    <th>Facebook Reward Type</th>
                    <th>Facebook Reward Value</th>
                    <th>Apple Reward Type</th>
                    <th>Apple Reward Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {socials.map((social) => (
                    <tr key={social._id}>
                      {editingId === social._id ? (
                        <>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="google_connect_reward_type"
                              value={editData.google_connect_reward_type}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="google_connect_reward_value"
                              value={editData.google_connect_reward_value}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="facebook_connect_reward_type"
                              value={editData.facebook_connect_reward_type}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="facebook_connect_reward_value"
                              value={editData.facebook_connect_reward_value}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              name="apple_connect_reward_type"
                              value={editData.apple_connect_reward_type}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              name="apple_connect_reward_value"
                              value={editData.apple_connect_reward_value}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={handleUpdateSocial}
                              disabled={updatingId === social._id}
                            >
                              {updatingId === social._id ? 'Updating...' : 'Save'}
                            </button>
                            <button className="btn btn-secondary btn-sm me-2" onClick={cancelEditing}>
                              Cancel
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteSocial(social._id)}
                              disabled={deletingId === social._id}
                            >
                              {deletingId === social._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{social.google_connect_reward_type}</td>
                          <td>{social.google_connect_reward_value}</td>
                          <td>{social.facebook_connect_reward_type}</td>
                          <td>{social.facebook_connect_reward_value}</td>
                          <td>{social.apple_connect_reward_type}</td>
                          <td>{social.apple_connect_reward_value}</td>
                          <td>
                            <button className="btn btn-warning btn-sm me-2 text-white" onClick={() => startEditing(social)}>
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteSocial(social._id)}
                              disabled={deletingId === social._id}
                            >
                              {deletingId === social._id ? 'Deleting...' : 'Delete'}
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

export default SocialRewards;
