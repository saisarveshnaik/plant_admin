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
  // State for tab navigation
  const [activeTab, setActiveTab] = useState<string>('dataConfig');
  // State to toggle between main table and details view in first tab
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  // State for plant list (could be fetched from an API)
  const [plants, setPlants] = useState<Plant[]>(samplePlants);
  // State for editable lifecycle and health tables
  const [lifecycleData, setLifecycleData] = useState<LifecycleRow[]>(defaultLifecycle);
  const [plantHealthData, setPlantHealthData] = useState<HealthRow[]>(defaultPlantHealth);
  // States for search and category filter (not fully implemented)
  const [searchText, setSearchText] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Handler for changing lifecycle inputs
  const handleLifecycleChange = (index: number, field: 'essence' | 'days') => (e: ChangeEvent<HTMLInputElement>) => {
    const updated = [...lifecycleData];
    updated[index] = {
      ...updated[index],
      [field]: Number(e.target.value)
    };
    setLifecycleData(updated);
  };

  // Handler for changing plant health inputs
  const handleHealthChange = (index: number, field: 'resources' | 'halfLife') => (e: ChangeEvent<HTMLInputElement>) => {
    const updated = [...plantHealthData];
    // If halfLife, allow string to represent empty values.
    updated[index] = {
      ...updated[index],
      [field]: field === 'halfLife' && e.target.value === '' ? '' : Number(e.target.value)
    };
    setPlantHealthData(updated);
  };

  // Handler when clicking the "View Details" button
  const handleViewDetails = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowDetails(true);
  };

  // Handler for the "Back" button in details view
  const handleBack = () => {
    setShowDetails(false);
    setSelectedPlant(null);
  };

  // Handler for search button (dummy handler for now)
  const handleSearch = () => {
    // Implement filtering logic if needed.
    console.log('Searching for:', searchText, 'Category:', filterCategory);
  };

  // Handler for saving lifecycle data (dummy implementation)
  const handleSaveLifecycle = () => {
    console.log('Lifecycle data saved:', lifecycleData);
  };

  // Handler for saving plant health data (dummy implementation)
  const handleSavePlantHealth = () => {
    console.log('Plant health data saved:', plantHealthData);
  };

  // Handler for new plant form submission (dummy implementation)
  const handleAddPlant = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Extract form data and update plants state as needed.
    console.log('New plant added');
  };

  return (
    <div className="cards-outer">
        <div className='users-table-div p-3'>
      <Tabs
        id="plant-config-tabs"
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k || 'dataConfig');
          // Reset details view if switching tab
          setShowDetails(false);
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
                  <Form.Select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
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
            <Button variant="primary" type="submit">
              Add Plant
            </Button>
          </Form>
        </Tab>
      </Tabs>
    </div>
    </div>
  );
};

export default PlantConfig;
