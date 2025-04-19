import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from '../utils/axiosInstance';import Endpoints from '../endpoints';
import { Toast, ToastContainer, Modal, Button, Form } from 'react-bootstrap';

interface RankConfig {
  id: string;
  rankNo: number;
  levelno: number;
  inc_no: number;
  expValue: number;
  createdAt: string;
  updatedAt: string;
}

const ProgressionConfig: React.FC = () => {
  const [rankData, setRankData] = useState<RankConfig[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState<RankConfig | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRank, setNewRank] = useState({ rankNo: 0, levelno: 0, inc_no: 10 });
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchRankData = async () => {
      try {
        const response = await axios.get(Endpoints.PlayerRankProgression.GET,
          { headers: { token: token || '' } }
        );
        if (response.data?.status) {
          setRankData(response.data.data.map((item: any) => ({
            id: item._id,
            rankNo: item.rankNo,
            levelno: item.levelno,
            inc_no: item.inc_no,
            expValue: item.expValue,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          })));
        }
      } catch (err) {
        console.error('Error fetching rank data:', err);
      }
    };

    fetchRankData();
  }, []);

  const handleInputChange = (index: number, field: keyof RankConfig, value: string | number) => {
    const updated = [...rankData];
    (updated[index] as any)[field] = field === 'rankNo' || field === 'expValue' || field === 'levelno' || field === 'inc_no' ? Number(value) : value;
    setRankData(updated);
  };

  const handleAddRank = () => {
    setShowAddModal(true);
  };

  const handleSaveNewRank = async () => {
    try {
      await axios.post(Endpoints.PlayerRankProgression.ADD, {
        rankNo: newRank.rankNo,
        levelno: newRank.levelno,
        inc_no: newRank.inc_no,
      }, {
        headers: { token: token || '' },
      });
      setToastMessage('New rank config added');
      setShowToast(true);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding new rank config:', error);
    }
  };

  const handleEdit = (rank: RankConfig) => {
    setCurrentEdit(rank);
    setShowEditModal(true);
  };

  const handleUpdateRank = async () => {
    if (!currentEdit) return;
    try {
      await axios.post(Endpoints.PlayerRankProgression.UPDATE(String(currentEdit.id)), currentEdit, {
        headers: { token: token || '' },
      });
      setToastMessage('Rank updated successfully');
      setShowToast(true);
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating rank:', err);
    }
  };

  const handleSaveRanks = async () => {
    try {
      await axios.post(Endpoints.PlayerRankProgression.ADD, rankData, {
        headers: { token: token || '' }
      });
      setToastMessage('Rank progression saved successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error saving rank progression:', error);
    }
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
                  <th>Rank No</th>
                  <th>Level No</th>
                  <th>Increment No</th>
                  <th>Created At</th>
                  <th>Last Activity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rankData.map((rankItem, index) => (
                  <tr key={rankItem.id}>
                    <td>{rankItem.rankNo}</td>
                    <td>{rankItem.levelno?? 'N/A'}</td>
                    <td>{rankItem.expValue}</td>
                    <td>{new Date(rankItem.createdAt).toLocaleString()}</td>
                    <td>{new Date(rankItem.updatedAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(rankItem)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary" onClick={handleAddRank}>
            + Add New Config
          </button>
          <button className="btn btn-primary mt-2" onClick={handleSaveRanks}>
            Save Changes
          </button>
          <ToastContainer position="top-end" className="p-3">
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="success">
              <Toast.Body className="text-white">{toastMessage}</Toast.Body>
            </Toast>
          </ToastContainer>
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Rank</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Rank No</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentEdit?.rankNo ?? 0}
                    onChange={(e) =>
                      setCurrentEdit((prev) => prev ? { ...prev, rankNo: Number(e.target.value) } : null)
                    }
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Level No</Form.Label>
                  <Form.Control
                    type="number"
                    value={newRank.levelno}
                    onChange={(e) => setNewRank({ ...newRank, levelno: Number(e.target.value) })}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Exp Required</Form.Label>
                  <Form.Control
                    type="number"
                    value={currentEdit?.expValue ?? 0}
                    onChange={(e) =>
                      setCurrentEdit((prev) => prev ? { ...prev, expValue: Number(e.target.value) } : null)
                    }
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateRank}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Rank Config</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Rank No</Form.Label>
                  <Form.Control
                    type="number"
                    value={newRank.rankNo}
                    onChange={(e) => setNewRank({ ...newRank, rankNo: Number(e.target.value) })}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Increment No</Form.Label>
                  <Form.Control
                    type="number"
                    value={newRank.inc_no}
                    onChange={(e) => setNewRank({ ...newRank, inc_no: Number(e.target.value) })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveNewRank}>
                Add Rank
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProgressionConfig;
