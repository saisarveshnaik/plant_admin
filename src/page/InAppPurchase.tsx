import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from '../utils/axiosInstance';import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Endpoints from '../endpoints';

interface AppPurchase {
  _id: string;
  platform: string;
  product_name: string;
  product_id: string;
  product_type: number;
  timer_type: number;
  timer_value: number;
  demo_price: string;
  reward_collection_type: number;
  reward_type: string;
  reward_value: string;
  reward_img: string;
  tag: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

const InAppPurchase: React.FC = () => {
  // State to hold fetched purchase records.
  const [purchases, setPurchases] = useState<AppPurchase[]>([]);

  // Complete new purchase initial state – all fields included.
  const [newPurchase, setNewPurchase] = useState({
    platform: 0,
    product_name: '',
    product_id: 0,
    product_type: 0,
    timer_type: 0,
    timer_value: 0,
    demo_price: 0,
    reward_collection_type: 0,
    reward_type: 0,
    reward_value: '',
    reward_img: '',
    tag: 0,
    status: 0,
  });

  // Loading states for add, update, and delete actions.
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<{ [key: string]: boolean }>({});
  const [loadingDelete, setLoadingDelete] = useState<{ [key: string]: boolean }>({});

  // Inline editing state for each purchase, keyed by the purchase _id.
  const [editValues, setEditValues] = useState<{ [key: string]: Partial<AppPurchase> }>({});

  // Get token from localStorage.
  const token = localStorage.getItem('authToken');

  // Fetch the list of purchases from the GET API.
  const fetchPurchases = async () => {
    try {
      const response = await axios.get(
        Endpoints.InAppPurchase.GET,
        { headers: { token } }
      );
      if (response.data.status) {
        setPurchases(response.data.data);
      } else {
        toast.error('Failed to fetch purchases');
      }
    } catch (error) {
      toast.error('Error fetching purchases');
    }
  };

  useEffect(() => {
    fetchPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form changes for "Add New Purchase"
  const handleNewPurchaseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For number fields, we convert the value to a number.
    const newValue = ['platform', 'product_id', 'product_type', 'timer_type', 'timer_value', 'demo_price', 'reward_collection_type', 'reward_type', 'tag', 'status'].includes(name)
      ? Number(value)
      : value;
    setNewPurchase({
      ...newPurchase,
      [name]: newValue,
    });
  };

  // Add Purchase API call.
  const handleAddPurchase = async () => {
    setLoadingAdd(true);
    try {
      await axios.post(
        Endpoints.InAppPurchase.ADD,
        newPurchase,
        { headers: { token } }
      );
      toast.success('Purchase added successfully!');
      await fetchPurchases();
      // Reset new purchase form.
      setNewPurchase({
        platform: 0,
        product_name: '',
        product_id: 0,
        product_type: 0,
        timer_type: 0,
        timer_value: 0,
        demo_price: 0,
        reward_collection_type: 0,
        reward_type: 0,
        reward_value: '',
        reward_img: '',
        tag: 0,
        status: 0,
      });
    } catch (error) {
      toast.error('Failed to add purchase');
    } finally {
      setTimeout(() => {
        setLoadingAdd(false);
      }, 1500);
    }
  };

  // Handle inline edit changes for individual purchase rows.
  const handleEditChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = ['platform', 'product_id', 'product_type', 'timer_type', 'timer_value', 'demo_price', 'reward_collection_type', 'reward_type', 'tag', 'status'].includes(name)
      ? Number(value)
      : value;
    setEditValues({
      ...editValues,
      [id]: {
        ...editValues[id],
        [name]: newValue,
      },
    });
  };

  // Update Purchase API call.
  const handleUpdatePurchase = async (purchase: AppPurchase) => {
    const id = purchase._id;
    setLoadingUpdate((prev) => ({ ...prev, [id]: true }));
    // Combine current purchase data with any inline changes.
    const updatedData = { ...purchase, ...editValues[id] };
    try {
      await axios.post(
        Endpoints.InAppPurchase.UPDATE(id),
        updatedData,
        { headers: { token } }
      );
      toast.success('Purchase updated successfully!');
      await fetchPurchases();
      // Clear inline edit values for this row.
      setEditValues((prev) => ({ ...prev, [id]: {} }));
    } catch (error) {
      toast.error('Failed to update purchase');
    } finally {
      setTimeout(() => {
        setLoadingUpdate((prev) => ({ ...prev, [id]: false }));
      }, 1500);
    }
  };

  // Delete Purchase API call.
  const handleDeletePurchase = async (purchase: AppPurchase) => {
    const id = purchase._id;
    setLoadingDelete((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(
        Endpoints.InAppPurchase.DELETE(id),
        { headers: { token } }
      );
      toast.success('Purchase deleted successfully!');
      await fetchPurchases();
    } catch (error) {
      toast.error('Failed to delete purchase');
    } finally {
      setTimeout(() => {
        setLoadingDelete((prev) => ({ ...prev, [id]: false }));
      }, 1500);
    }
  };

  return (
    <div className="cards-outer">
      <ToastContainer />
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">In App Purchase</h5>

          {/* Add New Purchase Form */}
          <div className="mb-4">
            <h6>Add New Purchase</h6>
            <form className="row g-3">
              <div className="col-md-3">
                <label htmlFor="product_name" className="form-label">Product Name</label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  className="form-control"
                  value={newPurchase.product_name}
                  onChange={handleNewPurchaseChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="product_id" className="form-label">Product ID</label>
                <input
                  type="number"
                  id="product_id"
                  name="product_id"
                  className="form-control"
                  value={newPurchase.product_id}
                  onChange={handleNewPurchaseChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="platform" className="form-label">Platform</label>
                <input
                  type="number"
                  id="platform"
                  name="platform"
                  className="form-control"
                  value={newPurchase.platform}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="product_type" className="form-label">Product Type</label>
                <input
                  type="number"
                  id="product_type"
                  name="product_type"
                  className="form-control"
                  value={newPurchase.product_type}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="timer_type" className="form-label">Timer Type</label>
                <input
                  type="number"
                  id="timer_type"
                  name="timer_type"
                  className="form-control"
                  value={newPurchase.timer_type}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="timer_value" className="form-label">Timer Value</label>
                <input
                  type="number"
                  id="timer_value"
                  name="timer_value"
                  className="form-control"
                  value={newPurchase.timer_value}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="demo_price" className="form-label">Demo Price</label>
                <input
                  type="number"
                  id="demo_price"
                  name="demo_price"
                  className="form-control"
                  value={newPurchase.demo_price}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="reward_collection_type" className="form-label">Reward Collection Type</label>
                <input
                  type="number"
                  id="reward_collection_type"
                  name="reward_collection_type"
                  className="form-control"
                  value={newPurchase.reward_collection_type}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="reward_type" className="form-label">Reward Type</label>
                <input
                  type="number"
                  id="reward_type"
                  name="reward_type"
                  className="form-control"
                  value={newPurchase.reward_type}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="reward_value" className="form-label">Reward Value</label>
                <input
                  type="text"
                  id="reward_value"
                  name="reward_value"
                  className="form-control"
                  value={newPurchase.reward_value}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="reward_img" className="form-label">Reward Img</label>
                <input
                  type="text"
                  id="reward_img"
                  name="reward_img"
                  className="form-control"
                  value={newPurchase.reward_img}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="tag" className="form-label">Tag</label>
                <input
                  type="number"
                  id="tag"
                  name="tag"
                  className="form-control"
                  value={newPurchase.tag}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="status" className="form-label">Status</label>
                <input
                  type="number"
                  id="status"
                  name="status"
                  className="form-control"
                  value={newPurchase.status}
                  onChange={handleNewPurchaseChange}
                />
              </div>
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddPurchase}
                  disabled={loadingAdd}
                >
                  {loadingAdd ? 'Adding...' : 'Add Purchase'}
                </button>
              </div>
            </form>
          </div>

          {/* Display Purchases Table with Inline Editing */}
          <div>
            <h6>Purchases List</h6>
            {purchases.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product Name</th>
                      <th>Product ID</th>
                      <th>Platform</th>
                      <th>Product Type</th>
                      <th>Timer Type</th>
                      <th>Timer Value</th>
                      <th>Demo Price</th>
                      <th>Reward Collection Type</th>
                      <th>Reward Type</th>
                      <th>Reward Value</th>
                      <th>Reward Img</th>
                      <th>Tag</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <input
                            type="text"
                            name="product_name"
                            className="form-control"
                            value={editValues[item._id]?.product_name ?? item.product_name}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="product_id"
                            className="form-control"
                            value={editValues[item._id]?.product_id ?? item.product_id}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="platform"
                            className="form-control"
                            value={editValues[item._id]?.platform ?? item.platform}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="product_type"
                            className="form-control"
                            value={editValues[item._id]?.product_type ?? item.product_type}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="timer_type"
                            className="form-control"
                            value={editValues[item._id]?.timer_type ?? item.timer_type}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="timer_value"
                            className="form-control"
                            value={editValues[item._id]?.timer_value ?? item.timer_value}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="demo_price"
                            className="form-control"
                            value={editValues[item._id]?.demo_price ?? item.demo_price}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="reward_collection_type"
                            className="form-control"
                            value={editValues[item._id]?.reward_collection_type ?? item.reward_collection_type}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="reward_type"
                            className="form-control"
                            value={editValues[item._id]?.reward_type ?? item.reward_type}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="reward_value"
                            className="form-control"
                            value={editValues[item._id]?.reward_value ?? item.reward_value}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="reward_img"
                            className="form-control"
                            value={editValues[item._id]?.reward_img ?? item.reward_img}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="tag"
                            className="form-control"
                            value={editValues[item._id]?.tag ?? item.tag}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="status"
                            className="form-control"
                            value={editValues[item._id]?.status ?? item.status}
                            onChange={(e) => handleEditChange(item._id, e)}
                          />
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              className="btn btn-success btn-sm me-2 text-white" 
                              onClick={() => handleUpdatePurchase(item)}
                              disabled={loadingUpdate[item._id]}
                            >
                              {loadingUpdate[item._id] ? 'Updating...' : 'Update'}
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeletePurchase(item)}
                              disabled={loadingDelete[item._id]}
                            >
                              {loadingDelete[item._id] ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No Purchases Found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InAppPurchase;
