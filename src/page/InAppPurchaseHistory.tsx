import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from '../utils/axiosInstance';import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Endpoints from '../endpoints';

interface AppPurchaseHistory {
  _id: string;
  playerId: string;
  in_app_purchase_id: string;
  transaction_id: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

const InAppPurchaseHistory: React.FC = () => {
  const [histories, setHistories] = useState<AppPurchaseHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States for handling UI feedback on action buttons.
  const [adding, setAdding] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // For inline editing (only status will be updated).
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<number>(0);

  // For the add new purchase history form.
  const [newHistory, setNewHistory] = useState({
    playerId: '',
    in_app_purchase_id: '',
    transaction_id: '',
    status: 0,
  });

  // Get token from local storage.
  const token = localStorage.getItem('authToken');

  // Function to fetch purchase history data (called automatically on mount).
  const fetchHistories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        Endpoints.InAppPurchaseHistory.GET,
        { headers: { token: token || '' } }
      );
      if (res.data.status) {
        setHistories(res.data.data);
        toast.success('Purchase history fetched successfully!');
      } else {
        toast.error('Failed to fetch purchase history.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching purchase history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changes for the add new history form.
  const handleNewChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewHistory((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handle add new history submission.
  const handleAddHistory = async (e: FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await axios.post(
        Endpoints.InAppPurchaseHistory.ADD,
        newHistory,
        { headers: { token: token || '' } }
      );
      if (res.data.status) {
        toast.success('Purchase history added successfully!');
        // Append the new record to local state.
        setHistories((prev) => [...prev, res.data.data]);
        // Reset the add form.
        setNewHistory({
          playerId: '',
          in_app_purchase_id: '',
          transaction_id: '',
          status: 0,
        });
      } else {
        toast.error('Failed to add purchase history.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error adding purchase history.');
    } finally {
      setTimeout(() => {
        setAdding(false);
      }, 1500);
    }
  };

  // Start inline editing for updating the status.
  const startEditing = (record: AppPurchaseHistory) => {
    setEditingId(record._id);
    setEditStatus(record.status);
  };

  // Handle change for inline edit (for status).
  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, type } = e.target;
    // Ensure conversion to number.
    setEditStatus(Number(value));
  };

  // Handle update history submission.
  const handleUpdateHistory = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setUpdatingId(editingId);
    try {
      const res = await axios.post(
        Endpoints.InAppPurchaseHistory.UPDATE(editingId),
        { status: editStatus },
        { headers: { token: token || '' } }
      );
      if (res.data.status) {
        toast.success('Purchase history updated successfully!');
        // Update the record in local state.
        setHistories((prev) =>
          prev.map((rec) =>
            rec._id === editingId ? res.data.data : rec
          )
        );
        setEditingId(null);
      } else {
        toast.error('Failed to update purchase history.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating purchase history.');
    } finally {
      setTimeout(() => {
        setUpdatingId(null);
      }, 1500);
    }
  };

  // Handle delete history.
  const handleDeleteHistory = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await axios.delete(Endpoints.InAppPurchaseHistory.DELETE(id), { headers: { token: token || '' } });
      if (res.data.status) {
        toast.success('Purchase history deleted successfully!');
        // Remove the record from local state.
        setHistories((prev) => prev.filter((rec) => rec._id !== id));
      } else {
        toast.error('Failed to delete purchase history.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error deleting purchase history.');
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
          <h5 className="card-title mb-4">In App Purchase History</h5>

          {/* Add New Purchase History Form */}
          <form onSubmit={handleAddHistory} className="mb-4">
            <h6>Add New Purchase History</h6>
            <div className="row g-2">
              <div className="col-md-3">
                <label htmlFor="playerId" className="form-label">Player ID</label>
                <input
                  type="text"
                  id="playerId"
                  name="playerId"
                  className="form-control"
                  value={newHistory.playerId}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="in_app_purchase_id" className="form-label">App Purchase ID</label>
                <input
                  type="text"
                  id="in_app_purchase_id"
                  name="in_app_purchase_id"
                  className="form-control"
                  value={newHistory.in_app_purchase_id}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="transaction_id" className="form-label">Transaction ID</label>
                <input
                  type="text"
                  id="transaction_id"
                  name="transaction_id"
                  className="form-control"
                  value={newHistory.transaction_id}
                  onChange={handleNewChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="status" className="form-label">Status</label>
                <input
                  type="number"
                  id="status"
                  name="status"
                  className="form-control"
                  value={newHistory.status}
                  onChange={handleNewChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3" disabled={adding}>
              {adding ? 'Adding...' : 'Add Purchase History'}
            </button>
          </form>

          {/* Display List of Purchase Histories */}
          {loading ? (
            <p>Loading...</p>
          ) : histories.length === 0 ? (
            <p>No purchase history available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Player ID</th>
                    <th>App Purchase ID</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.map((record) => (
                    <tr key={record._id}>
                      <td>{record.playerId}</td>
                      <td>{record.in_app_purchase_id}</td>
                      <td>{record.transaction_id}</td>
                      {editingId === record._id ? (
                        <>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={editStatus}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td>{new Date(record.createdAt).toLocaleString()}</td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={handleUpdateHistory}
                              disabled={updatingId === record._id}
                            >
                              {updatingId === record._id ? 'Updating...' : 'Save'}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm me-2"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteHistory(record._id)}
                              disabled={deletingId === record._id}
                            >
                              {deletingId === record._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{record.status}</td>
                          <td>{new Date(record.createdAt).toLocaleString()}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2 text-white"
                              onClick={() => startEditing(record)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteHistory(record._id)}
                              disabled={deletingId === record._id}
                            >
                              {deletingId === record._id ? 'Deleting...' : 'Delete'}
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

export default InAppPurchaseHistory;
