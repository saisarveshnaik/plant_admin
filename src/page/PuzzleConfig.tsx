import React, { useState, ChangeEvent } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';

interface Puzzle {
  gameNo: number;
  levelno: number;
  d_sunlight: number;
  d_water: number;
  d_nutrients: number;
  n_sunlight: number;
  n_water: number;
  n_nutrients: number;
  reward_exp: number;
  createdAt: string;
  updatedAt: string;
}

const initialPuzzleData: Puzzle[] = [
  {
    gameNo: 0,
    levelno: 2,
    d_sunlight: 2,
    d_water: 2,
    d_nutrients: 2,
    n_sunlight: 2,
    n_water: 2,
    n_nutrients: 2,
    reward_exp: 2,
    createdAt: "2025-01-16T05:56:21.567Z",
    updatedAt: "2025-02-24T14:17:30.625Z"
  }
];

const PuzzleConfig: React.FC = () => {
  // Modal controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);

  // Puzzle list state
  const [puzzles, setPuzzles] = useState<Puzzle[]>(initialPuzzleData);

  // Add Puzzle Form state
  const [newGameNo, setNewGameNo] = useState(0);
  const [newLevelNo, setNewLevelNo] = useState(0);
  const [newIncrement, setNewIncrement] = useState(1);

  // Levels Modal state (update puzzle level details)
  const [updatedDSunlight, setUpdatedDSunlight] = useState(0);
  const [updatedDWater, setUpdatedDWater] = useState(0);
  const [updatedDNutrients, setUpdatedDNutrients] = useState(0);
  const [updatedNSunlight, setUpdatedNSunlight] = useState(0);
  const [updatedNWater, setUpdatedNWater] = useState(0);
  const [updatedNNutrients, setUpdatedNNutrients] = useState(0);
  const [updatedRewardExp, setUpdatedRewardExp] = useState(0);

  // Add a new puzzle
  const handleAddPuzzle = () => {
    const newPuzzle: Puzzle = {
      gameNo: newGameNo,
      levelno: newLevelNo,
      d_sunlight: newIncrement,
      d_water: newIncrement,
      d_nutrients: newIncrement,
      n_sunlight: newIncrement,
      n_water: newIncrement,
      n_nutrients: newIncrement,
      reward_exp: newIncrement,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPuzzles([...puzzles, newPuzzle]);
    setShowAddModal(false);
  };

  // Open Levels Modal with selected puzzle data
  const handleOpenLevelsModal = (puzzle: Puzzle) => {
    setSelectedPuzzle(puzzle);
    setUpdatedDSunlight(puzzle.d_sunlight);
    setUpdatedDWater(puzzle.d_water);
    setUpdatedDNutrients(puzzle.d_nutrients);
    setUpdatedNSunlight(puzzle.n_sunlight);
    setUpdatedNWater(puzzle.n_water);
    setUpdatedNNutrients(puzzle.n_nutrients);
    setUpdatedRewardExp(puzzle.reward_exp);
    setShowLevelsModal(true);
  };

  // Update puzzle data with new level details
  const handleUpdatePuzzle = () => {
    if (selectedPuzzle) {
      const updatedPuzzle = {
        ...selectedPuzzle,
        d_sunlight: updatedDSunlight,
        d_water: updatedDWater,
        d_nutrients: updatedDNutrients,
        n_sunlight: updatedNSunlight,
        n_water: updatedNWater,
        n_nutrients: updatedNNutrients,
        reward_exp: updatedRewardExp,
        updatedAt: new Date().toISOString()
      };
      const updatedPuzzles = puzzles.map(p => p === selectedPuzzle ? updatedPuzzle : p);
      setPuzzles(updatedPuzzles);
      setShowLevelsModal(false);
      setSelectedPuzzle(null);
    }
  };

  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Top area with title and small Add Puzzle button */}
          <div className=" mb-3">
            <div className='row'>
                <div className='col-md-8'><h5 className="card-title">Puzzle Config</h5></div>
                <div className='col-md-4'>
                <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              Add Puzzle
            </Button>
                </div>
            </div>
            
            
          </div>

          {/* Puzzle data table */}
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Game No</th>
                  <th>Level No</th>
                  <th>d_sunlight</th>
                  <th>d_water</th>
                  <th>d_nutrients</th>
                  <th>n_sunlight</th>
                  <th>n_water</th>
                  <th>n_nutrients</th>
                  <th>reward_exp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {puzzles.map((puzzle, index) => (
                  <tr key={index}>
                    <td>{puzzle.gameNo}</td>
                    <td>{puzzle.levelno}</td>
                    <td>{puzzle.d_sunlight}</td>
                    <td>{puzzle.d_water}</td>
                    <td>{puzzle.d_nutrients}</td>
                    <td>{puzzle.n_sunlight}</td>
                    <td>{puzzle.n_water}</td>
                    <td>{puzzle.n_nutrients}</td>
                    <td>{puzzle.reward_exp}</td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleOpenLevelsModal(puzzle)}>
                        See Levels
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add Puzzle Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Puzzle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGameNo">
              <Form.Label>Game Number</Form.Label>
              <Form.Control
                type="number"
                value={newGameNo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewGameNo(Number(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="formLevelNo" className="mt-3">
              <Form.Label>Level Number</Form.Label>
              <Form.Control
                type="number"
                value={newLevelNo}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewLevelNo(Number(e.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="formIncrement" className="mt-3">
              <Form.Label>Increment Number: {newIncrement}</Form.Label>
              <Form.Range
                min={1}
                max={500}
                value={newIncrement}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewIncrement(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddPuzzle}>
            Add Puzzle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Levels Modal */}
      <Modal show={showLevelsModal} onHide={() => setShowLevelsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Puzzle Levels Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPuzzle && (
            <Form>
              <Form.Group controlId="updateDSunlight">
                <Form.Label>d_sunlight</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedDSunlight}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdatedDSunlight(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId="updateDWater" className="mt-3">
                <Form.Label>d_water</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedDWater}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdatedDWater(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId="updateDNutrients" className="mt-3">
                <Form.Label>d_nutrients</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedDNutrients}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdatedDNutrients(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId="updateNSunlight" className="mt-3">
                <Form.Label>n_sunlight</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedNSunlight}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdatedNSunlight(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId="updateNWater" className="mt-3">
                <Form.Label>n_water</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedNWater}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdatedNWater(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId="updateNNutrients" className="mt-3">
                <Form.Label>n_nutrients</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedNNutrients}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdatedNNutrients(Number(e.target.value))}
                />
              </Form.Group>
              <Form.Group controlId="updateRewardExp" className="mt-3">
                <Form.Label>reward_exp</Form.Label>
                <Form.Control
                  type="number"
                  value={updatedRewardExp}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdatedRewardExp(Number(e.target.value))}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLevelsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdatePuzzle}>
            Update Puzzle
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PuzzleConfig;
