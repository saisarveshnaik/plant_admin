import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from '../utils/axiosInstance';import { Button, Form, Tabs, Tab, Table, Row, Col } from 'react-bootstrap';
import Endpoints from '../endpoints';
import { toast, ToastContainer } from 'react-toastify';

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
  resources: number;
  halfLife: number | string;
  min_health: number | string;
  max_health: number | string;
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
  { min_health: '0', max_health: 0, resources: 100, halfLife: '' },
  { min_health: '1', max_health: 20, resources: 90, halfLife: 12.55 },
  { min_health: '20', max_health: 40, resources: 80, halfLife: 7.59 },
  { min_health: '40', max_health: 60, resources: 30, halfLife: 4.59 },
  { min_health: '60', max_health: 80, resources: 30, halfLife: 2.78 },
  { min_health: '80', max_health: 85, resources: 30, halfLife: 1.59 },
  { min_health: '85', max_health: 95, resources: 20, halfLife: 0.79 },
  { min_health: '95', max_health: 100, resources: 10, halfLife: 0.48 }
];


const PlantConfig: React.FC = () => {
  // Tab navigation state
  const [activeTab, setActiveTab] = useState<string>('dataConfig');
  // For plant details view in first tab
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  // Plant list state
  const [plants, setPlants] = useState<Plant[]>([]);
  // Lifecycle and health data for details view
  const [lifecycleData, setLifecycleData] = useState<LifecycleRow[]>(defaultLifecycle);
  const [plantHealthData, setPlantHealthData] = useState<HealthRow[]>(defaultPlantHealth);
  const [formulaData, setFormulaData] = useState<any[]>([]);
  const [divisionData, setDivisionData] = useState<any[]>([]);
  // States for search and filter in first tab
  const [searchText, setSearchText] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // New Plant Config states (for Add New Plant Config tab)
  const [newPlantStages, setNewPlantStages] = useState<StageRow[]>([]);
  const [newPlantHealth, setNewPlantHealth] = useState<HealthRow[]>([]);
  const [newFormulaData, setNewFormulaData] = useState([
    { l_res_1: '', l_res_2: '', l_res_3: '' }
  ]);

  const [newDivisionData, setNewDivisionData] = useState([
    { min: 0, max: 0, base: 0 }
  ]);

  // Add Rewards tab states
  const [rewardSearchText, setRewardSearchText] = useState<string>('');
  const [selectedPlantForReward, setSelectedPlantForReward] = useState<Plant | null>(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchPlantConfig = async () => {
      try {
        const response = await axios.get(Endpoints.Plant.GET,
          { headers: { token: token || '' } }
        );
        setPlants([]);
        if (response.data.status && response.data.data.length > 0) {

          console.log(response.data.data.length);
          for (let i = 0; i < response.data.data.length; i++) {
            const plant = response.data.data[i];

            // Map stages to lifecycleData format
            const mappedStages = plant.stages.map((stage: any) => ({
              stage: stage.stage,
              essence: stage.essense,
              days: 0  // default or adjust as needed
            }));

            // Map plant healths
            const mappedHealth = plant.plant_healths.map((health: any) => ({
              min_health: health.min_health,
              max_health: health.max_health,
              resources: health.resource_need,
              halfLife: health.decay_rate
            }));

            // Update state
            setLifecycleData(mappedStages);
            setPlantHealthData(mappedHealth);

            // Optionally push this plant to the list
            const mappedPlant: any = {
              serialId: plant.no,
              plantId: plant.id,
              plantName: plant.name,
              plantCategory: 'Unknown',
              plantDescription: 'Fetched from API',
              state: plant.status ? 'active' : 'inactive',
              formula: plant.formula,
              division: plant.division,
              stages: plant.stages,
              healths: plant.healths
            };
            setPlants((prevPlants) => {
              const updatedPlants = [...prevPlants, mappedPlant];
              console.log("New list inside setter:", updatedPlants);
              return updatedPlants;
            });
          }
        }
        console.log(plants);
      } catch (error) {
        console.error('Failed to fetch plant config:', error);
      }
    };

    fetchPlantConfig();
  }, []);

  const handleUpdatePlant = async () => {
    if (!selectedPlant) return;

    try {
      const requestBody = {
        name: selectedPlant.plantName,
        no: Number(selectedPlant.serialId),
        stages: lifecycleData.map((stage) => ({
          stage: stage.stage,
          essense: stage.essence
        })),
        plant_healths: plantHealthData.map((health) => {
          return {
            resource_need: health.resources,
            decay_rate: Number(health.halfLife),
            min_health: Number(health.min_health),
            max_health: Number(health.max_health)
          };
        }),
        sync_minute_time: selectedPlant.plantName || '', // or use another dynamic field
        formula: formulaData.map((item) => ({
          l_res_1: item.l_res_1,
          l_res_2: item.l_res_2,
          l_res_3: item.l_res_3
        })),
        division: divisionData.map((item) => ({
          min: Number(item.min),
          max: Number(item.max),
          base: Number(item.base)
        })),
        status: selectedPlant.state === 'active'
      };

      const response = await axios.post(
        Endpoints.Plant.UPDATE(selectedPlant.plantId),
        requestBody,
        { headers: { token: token || '' } }
      );

      console.log('Plant updated:', response.data);
      toast.success('Plant updated successfully!');
    } catch (error) {
      console.error('Error updating plant:', error);
      toast.error('Error updating plant!');
    }
  };

  const handleAddPlantToServer = async () => {
    try {
      const plant_no = (document.getElementById('formPlantNo') as HTMLInputElement).value;
      const syncMinuteTime = (document.getElementById('formSyncMinuteTime') as HTMLInputElement).value;
      const plantName = (document.getElementById('formPlantName') as HTMLInputElement).value;
      const plantState = (document.getElementById('formPlantState') as HTMLSelectElement).value;

      const requestBody = {
        name: plantName,
        no: Number(plant_no),
        stages: newPlantStages.map((stage) => ({
          stage: stage.stage,
          essense: stage.xp
        })),
        plant_healths: newPlantHealth.map((health) => {
          return {
            resource_need: health.resources,
            decay_rate: Number(health.halfLife),
            min_health: health.min_health,
            max_health: health.max_health
          };
        }),
        sync_minute_time: syncMinuteTime,
        formula: newFormulaData,
        division: newDivisionData,
        status: plantState === 'active'
      };

      const response = await axios.post(Endpoints.Plant.ADD, requestBody,
        { headers: { token: token || '' } }
      );
      toast.success('Plant added successfully!');
      console.log('Add response:', response.data);
    } catch (error) {
      console.error('Error adding plant:', error);
      toast.error('Failed to add plant.');
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    try {
      const response = await axios.delete(Endpoints.Plant.DELETE(plantId),
      { headers: { token: token || '' } }
    );
      toast.success('Plant deleted successfully!');
      setPlants((prev) => prev.filter((p) => p.plantId !== plantId));
    } catch (error) {
      console.error('Error deleting plant:', error);
      toast.error('Failed to delete plant.');
    }
  };

  // Lifecycle change handler (details view)
  const handleLifecycleChange = (
    index: number,
    field: 'essence' | 'stage',
    value: string | number
  ) => {
    const updated = [...lifecycleData];
    updated[index] = {
      ...updated[index],
      [field]: field === 'essence' ? Number(value) : value
    };
    setLifecycleData(updated);
  };

  // Plant health change handler (details view)
  const handleHealthChange = (
    index: number,
    field: 'resources' | 'halfLife' | 'division' | 'min_health' | 'max_health',
    value: string | number
  ) => {
    const updated = [...plantHealthData];
    updated[index] = {
      ...updated[index],
      [field]: field === 'division' ? value : Number(value)
    };
    setPlantHealthData(updated);
  };

  const handleFormulaChange = (
    index: number,
    field: 'l_res_1' | 'l_res_2' | 'l_res_3',
    value: string
  ) => {
    const updated = [...formulaData];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setFormulaData(updated);
  };

  const handleDivisionChange = (
    index: number,
    field: 'min' | 'max' | 'base',
    value: string
  ) => {
    const updated = [...divisionData];
    updated[index] = {
      ...updated[index],
      [field]: Number(value)
    };
    setDivisionData(updated);
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
    setNewPlantHealth([...newPlantHealth, { min_health: 0, max_health: 0, resources: 0, halfLife: '' }]);
  };

  const handleNewPlantHealthChange = (index: number, field: 'resources' | 'halfLife' | 'min_health' | 'max_health') => (
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

  const handleNewFormulaChange = (index: number, field: 'l_res_1' | 'l_res_2' | 'l_res_3', value: string) => {
    const updated = [...newFormulaData];
    updated[index][field] = value;
    setNewFormulaData(updated);
  };

  const handleNewDivisionChange = (index: number, field: 'min' | 'max' | 'base', value: string) => {
    const updated = [...newDivisionData];
    updated[index][field] = Number(value);
    setNewDivisionData(updated);
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

  React.useEffect(() => {
    if (selectedPlant) {
      // Assuming selectedPlant has formula and division properties from API
      setFormulaData((selectedPlant as any).formula || []);
      setDivisionData((selectedPlant as any).division || []);
    }
  }, [selectedPlant]);


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
                      <th>Stage</th>
                      <th>Essence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lifecycleData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="text"
                            value={row.stage}
                            onChange={(e) => handleLifecycleChange(index, 'stage', e.target.value)}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.essence}
                            onChange={(e) => handleLifecycleChange(index, 'essence', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <h5 className="mt-4">Plant Health</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Min Health</th>
                      <th>Max Health</th>
                      <th>Resource Need</th>
                      <th>Decay Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plantHealthData!.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.min_health}
                            onChange={(e) =>
                              handleHealthChange(index, 'min_health', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.max_health}
                            onChange={(e) =>
                              handleHealthChange(index, 'max_health', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.resources}
                            onChange={(e) =>
                              handleHealthChange(index, 'resources', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            step="0.01"
                            value={row.halfLife}
                            onChange={(e) =>
                              handleHealthChange(index, 'halfLife', e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <h5 className="mt-4">Formula</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>L Res 1</th>
                      <th>L Res 2</th>
                      <th>L Res 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formulaData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="text"
                            value={row.l_res_1}
                            onChange={(e) =>
                              handleFormulaChange(index, 'l_res_1', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={row.l_res_2}
                            onChange={(e) =>
                              handleFormulaChange(index, 'l_res_2', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            value={row.l_res_3}
                            onChange={(e) =>
                              handleFormulaChange(index, 'l_res_3', e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <h5 className="mt-4">Divisions</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Min</th>
                      <th>Max</th>
                      <th>Base</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisionData.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.min}
                            onChange={(e) =>
                              handleDivisionChange(index, 'min', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.max}
                            onChange={(e) =>
                              handleDivisionChange(index, 'max', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            value={row.base}
                            onChange={(e) =>
                              handleDivisionChange(index, 'base', e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="mt-4">
                  <Button variant="primary" onClick={handleUpdatePlant}>
                    Update
                  </Button>
                </div>
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
                          <Button
                            variant="danger"
                            size="sm"
                            className="me-2"
                            onClick={() => handleDeletePlant(plant.plantId)}
                          >
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
                    <th>Min Health</th>
                    <th>Max Health</th>
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
                          value={row.min_health}
                          onChange={handleNewPlantHealthChange(index, 'min_health')}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.max_health}
                          onChange={handleNewPlantHealthChange(index, 'max_health')}
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
              <h5 className="mt-4">Formula</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>L Res 1</th>
                    <th>L Res 2</th>
                    <th>L Res 3</th>
                  </tr>
                </thead>
                <tbody>
                  {newFormulaData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.l_res_1}
                          onChange={(e) => handleNewFormulaChange(index, 'l_res_1', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.l_res_2}
                          onChange={(e) => handleNewFormulaChange(index, 'l_res_2', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.l_res_3}
                          onChange={(e) => handleNewFormulaChange(index, 'l_res_3', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="secondary" onClick={() => setNewFormulaData([...newFormulaData, { l_res_1: '', l_res_2: '', l_res_3: '' }])}>
                Add Formula Row
              </Button>
              <h5 className="mt-4">Division</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Base</th>
                  </tr>
                </thead>
                <tbody>
                  {newDivisionData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Control
                          type="number"
                          value={row.min}
                          onChange={(e) => handleNewDivisionChange(index, 'min', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={row.max}
                          onChange={(e) => handleNewDivisionChange(index, 'max', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={row.base}
                          onChange={(e) => handleNewDivisionChange(index, 'base', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="secondary" onClick={() => setNewDivisionData([...newDivisionData, { min: 0, max: 0, base: 0 }])}>
                Add Division Row
              </Button>
              {/* Plant Details Form */}
              <Form.Group className="mb-3" controlId="formPlantNo">
                <Form.Label>Plant Number</Form.Label>
                <Form.Control type="text" placeholder="Enter Plant Number" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formSyncMinuteTime">
                <Form.Label>Sync Minute Time</Form.Label>
                <Form.Control type="text" placeholder="Enter Sync Minute Time" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPlantName">
                <Form.Label>Plant Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Plant Name" />
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
                  <Button
                    variant="success"
                    onClick={() => {
                      handleAddPlantToServer();
                    }
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PlantConfig;
