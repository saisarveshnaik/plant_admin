import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Form, Tabs, Tab, Table, Row, Col } from 'react-bootstrap';

interface Plant {
  serialId: string;
  plantId: string;
  plantName: string;
  plantCategory: string;
  plantDescription: string;
  state: string;
}

interface LifecycleRow {
  stage: string;
  essence: number;
  days: number;
}

interface HealthRow {
  division: string;
  resources: number;
  halfLife: number | string;
}

interface StageRow {
  stage: string;
  xp: number;
}

const defaultLifecycle: LifecycleRow[] = [
  { stage: 'Seedling', essence: 0, days: 0 },
  { stage: 'Sprouting', essence: 1, days: 0 },
  { stage: 'Sapling', essence: 303, days: 10 },
  { stage: 'Vegetation growth', essence: 606, days: 20 },
  { stage: 'Flowering', essence: 908, days: 30 },
  { stage: 'Fruit development', essence: 454, days: 15 },
  { stage: 'Maturity', essence: 454, days: 15 },
  { stage: 'Harvesting', essence: 454, days: 15 }
];

const defaultPlantHealth: HealthRow[] = [
  { division: '0', resources: 100, halfLife: '' },
  { division: '1-20', resources: 90, halfLife: 12.55 },
  { division: '20-40', resources: 80, halfLife: 7.59 },
  { division: '40-60', resources: 30, halfLife: 4.59 },
  { division: '60-80', resources: 30, halfLife: 2.78 },
  { division: '80-85', resources: 30, halfLife: 1.59 },
  { division: '85-95', resources: 20, halfLife: 0.79 },
  { division: '95-100', resources: 10, halfLife: 0.48 }
];

const samplePlants: Plant[] = [
  {
    serialId: '1',
    plantId: 'P001',
    plantName: 'Rose',
    plantCategory: 'Flower',
    plantDescription: 'Red rose plant',
    state: 'active'
  },
  {
    serialId: '2',
    plantId: 'P002',
    plantName: 'Tulip',
    plantCategory: 'Flower',
    plantDescription: 'Tulip plant',
    state: 'inactive'
  }
];

const PlantConfig: React.FC = () => {
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<string>('dataConfig');
  // For plant details view in first tab
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  // Plant list state
  const [plants, setPlants] = useState<Plant[]>(samplePlants);
  // Lifecycle and health data for details view
  const [lifecycleData, setLifecycleData] = useState<LifecycleRow[]>(defaultLifecycle);
  const [plantHealthData, setPlantHealthData] = useState<HealthRow[]>(defaultPlantHealth);
  // States for search and filter in first tab
  const [searchText, setSearchText] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // New Plant Config states (for Add New Plant Config tab)
  const [newPlantStages, setNewPlantStages] = useState<StageRow[]>([]);
  const [newPlantHealth, setNewPlantHealth] = useState<HealthRow[]>([]);

  // Add Rewards tab states
  const [rewardSearchText, setRewardSearchText] = useState<string>('');
  const [selectedPlantForReward, setSelectedPlantForReward] = useState<Plant | null>(null);
  // For simplicity, rewards are not stored persistently in this demo

  // Lifecycle change handler (details view)
  const handleLifecycleChange = (index: number, field: 'essence' | 'days') => (e: ChangeEvent<HTMLInputElement>) => {
    const updated = [...lifecycleData];
    updated[index] = {
      ...updated[index],
      [field]: Number(e.target.value)
    };
    setLifecycleData(updated);
  };

  // Plant health change handler (details view)
  const handleHealthChange = (index: number, field: 'resources' | 'halfLife') => (e: ChangeEvent<HTMLInputElement>) => {
    const updated = [...plantHealthData];
    updated[index] = {
      ...updated[index],
      [field]: field === 'halfLife' && e.target.value === '' ? '' : Number(e.target.value)
    };
    setPlantHealthData(updated);
  };

  // Handlers for Add New Plant Config - Stage rows

  // For the stage dropdown
  const handleStageSelectChange = (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
    const updated = [...newPlantStages];
    updated[index] = {
      ...updated[index],
      stage: e.target.value
    };
    setNewPlantStages(updated);
  };

  // For the XP input
  const handleStageXpChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const updated = [...newPlantStages];
    updated[index] = {
      ...updated[index],
      xp: Number(e.target.value)
    };
    setNewPlantStages(updated);
  };

  const addNewStage = () => {
    setNewPlantStages([...newPlantStages, { stage: '', xp: 0 }]);
  };

  const removeStage = (index: number) => {
    const updated = [...newPlantStages];
    updated.splice(index, 1);
    setNewPlantStages(updated);
  };

  // Handlers for Add New Plant Config - Plant Health rows
  const addNewPlantHealthRow = () => {
    setNewPlantHealth([...newPlantHealth, { division: '', resources: 0, halfLife: '' }]);
  };

  const handleNewPlantHealthChange = (index: number, field: 'division' | 'resources' | 'halfLife') => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const updated = [...newPlantHealth];
    updated[index] = {
      ...updated[index],
      [field]:
        field === 'resources' || field === 'halfLife'
          ? e.target.value === '' ? '' : Number(e.target.value)
          : e.target.value
    };
    setNewPlantHealth(updated);
  };

  const removePlantHealthRow = (index: number) => {
    const updated = [...newPlantHealth];
    updated.splice(index, 1);
    setNewPlantHealth(updated);
  };

  // Handlers for the "View Details" button (details view)
  const handleViewDetails = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowDetails(true);
  };

  // Back button handler in details view
  const handleBack = () => {
    setShowDetails(false);
    setSelectedPlant(null);
  };

  // Dummy search handler (first tab)
  const handleSearch = () => {
    console.log('Searching for:', searchText, 'Category:', filterCategory);
  };

  // Dummy save handlers for details view
  const handleSaveLifecycle = () => {
    console.log('Lifecycle data saved:', lifecycleData);
  };

  const handleSavePlantHealth = () => {
    console.log('Plant health data saved:', plantHealthData);
  };

  // Dummy add plant handler for Add New Plant Config tab
  const handleAddPlant = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('New plant added with config:', { newPlantStages, newPlantHealth });
  };

  return (
    <div className="cards-outer">
      <div className="users-table-div p-3">
        <Tabs
          id="plant-config-tabs"
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k || 'dataConfig');
            setShowDetails(false);
            setSelectedPlantForReward(null);
          }}
          className="mb-3"
        >
          <Tab eventKey="dataConfig" title="Plant Data Config">
            {showDetails ? (
              <div>
                <Button variant="secondary" className="mb-3" onClick={handleBack}>
                  Back
                </Button>
                <h3>Plant Details for {selectedPlant?.plantName}</h3>
                <h5 className="mt-4">Plant Lifecycle</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Plant Stages</th>
                      <th>Total Essence Required</th>
                      <th>Time Required in Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lifecycleData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.stage}</td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.essence}
                            onChange={handleLifecycleChange(index, 'essence')}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.days}
                            onChange={handleLifecycleChange(index, 'days')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button variant="primary" className="mb-4" onClick={handleSaveLifecycle}>
                  Save Lifecycle
                </Button>
                <h5 className="mt-4">Plant Health</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Plant Health Divisions</th>
                      <th>Resources per 5 point in Health</th>
                      <th>HALF LIFE FACTOR % of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantHealthData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.division}</td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.resources}
                            onChange={handleHealthChange(index, 'resources')}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={row.halfLife}
                            onChange={handleHealthChange(index, 'halfLife')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Button variant="primary" onClick={handleSavePlantHealth}>
                  Save Plant Health
                </Button>
              </div>
            ) : (
              <div>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Control
                      type="text"
                      placeholder="Search plants..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                      <option value="">Filter by category</option>
                      <option value="Flower">Flower</option>
                      <option value="Tree">Tree</option>
                      <option value="Herb">Herb</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <Button variant="secondary" onClick={handleSearch}>
                      Search
                    </Button>
                  </Col>
                </Row>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Serial ID</th>
                      <th>Plant ID</th>
                      <th>Plant Name</th>
                      <th>Plant Category</th>
                      <th>Plant Description</th>
                      <th>State</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plants.map((plant) => (
                      <tr key={plant.serialId}>
                        <td>{plant.serialId}</td>
                        <td>{plant.plantId}</td>
                        <td>{plant.plantName}</td>
                        <td>{plant.plantCategory}</td>
                        <td>{plant.plantDescription}</td>
                        <td>{plant.state}</td>
                        <td>
                          <Button variant="danger" size="sm" className="me-2">
                            Delete
                          </Button>
                          <Button variant="info" size="sm" onClick={() => handleViewDetails(plant)}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>

          <Tab eventKey="addNew" title="Add New Plant Config">
            <Form onSubmit={handleAddPlant}>
              {/* Stages of Plant Table */}
              <h5>Stages of Plant</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>XP Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newPlantStages.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select value={row.stage} onChange={handleStageSelectChange(index)}>
                          <option value="">Select Stage</option>
                          <option value="Seedling">Seedling</option>
                          <option value="Sprouting">Sprouting</option>
                          <option value="Sapling">Sapling</option>
                          <option value="Vegetation">Vegetation</option>
                          <option value="Flowering">Flowering</option>
                          <option value="Fruit Development">Fruit Development</option>
                          <option value="Maturity">Maturity</option>
                          <option value="Harvesting">Harvesting</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={row.xp}
                          onChange={handleStageXpChange(index)}
                        />
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => removeStage(index)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="secondary" onClick={addNewStage}>
                Add Stage
              </Button>

              {/* Plant Health Table */}
              <h5 className="mt-4">Plant Health</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Division Range</th>
                    <th>Resources per 5 point in Health</th>
                    <th>Half Life Factor (Decay Life)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newPlantHealth.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.division}
                          onChange={handleNewPlantHealthChange(index, 'division')}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={row.resources}
                          onChange={handleNewPlantHealthChange(index, 'resources')}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={row.halfLife}
                          onChange={handleNewPlantHealthChange(index, 'halfLife')}
                        />
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => removePlantHealthRow(index)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="secondary" onClick={addNewPlantHealthRow}>
                Add Health Row
              </Button>

              {/* Plant Details Form */}
              <Form.Group className="mb-3" controlId="formSerialId">
                <Form.Label>Serial ID</Form.Label>
                <Form.Control type="text" placeholder="Enter Serial ID" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPlantId">
                <Form.Label>Plant ID</Form.Label>
                <Form.Control type="text" placeholder="Enter Plant ID" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPlantName">
                <Form.Label>Plant Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Plant Name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPlantCategory">
                <Form.Label>Plant Category</Form.Label>
                <Form.Control type="text" placeholder="Enter Plant Category" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPlantDescription">
                <Form.Label>Plant Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter Plant Description" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPlantState">
                <Form.Label>State</Form.Label>
                <Form.Select>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
              <Row className="mt-3">
                <Col>
                  <Button variant="primary" type="submit">
                    Add Plant
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="success"
                    onClick={() =>
                      console.log('Save new plant config', { newPlantStages, newPlantHealth })
                    }
                  >
                    Save Value
                  </Button>
                </Col>
              </Row>
            </Form>
          </Tab>

          <Tab eventKey="addRewards" title="Add Rewards">
            {/* Plant search section */}
            <h5>Search Plants</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by ID or Name"
                  value={rewardSearchText}
                  onChange={(e) => setRewardSearchText(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Button variant="secondary" onClick={() => console.log('Search rewards for:', rewardSearchText)}>
                  Search
                </Button>
              </Col>
            </Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Serial ID</th>
                  <th>Plant ID</th>
                  <th>Plant Name</th>
                  <th>Plant Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plants
                  .filter(
                    (plant) =>
                      plant.plantId.includes(rewardSearchText) ||
                      plant.plantName.toLowerCase().includes(rewardSearchText.toLowerCase())
                  )
                  .map((plant) => (
                    <tr key={plant.serialId}>
                      <td>{plant.serialId}</td>
                      <td>{plant.plantId}</td>
                      <td>{plant.plantName}</td>
                      <td>{plant.plantCategory}</td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => setSelectedPlantForReward(plant)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>

            {/* Reward details section */}
            {selectedPlantForReward && (
              <div className="mt-4">
                <h5>Plant Details: {selectedPlantForReward.plantName}</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th>Reward</th>
                      <th>Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lifecycleData.map((stage, index) => (
                      <tr key={index}>
                        <td>{stage.stage}</td>
                        <td>
                          <Form.Control type="text" placeholder="Enter reward" />
                        </td>
                        <td>
                          <Form.Control type="text" placeholder="Enter link" />
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => console.log('Add reward for stage', stage.stage)}
                          >
                            Add Reward
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default PlantConfig;
