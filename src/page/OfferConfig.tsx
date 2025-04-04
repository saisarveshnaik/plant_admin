import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Form, Tabs, Tab, Table, Row, Col } from 'react-bootstrap';

interface Offer {
  offerId: string;
  offerName: string;
  pricePoint: number;
  enabled: boolean;
}

const dummyComboOffers: Offer[] = [
  { offerId: 'C001', offerName: 'Combo Offer 1', pricePoint: 100, enabled: true },
  { offerId: 'C002', offerName: 'Combo Offer 2', pricePoint: 150, enabled: false },
];

const dummyDailyDeals: Offer[] = [
  { offerId: 'D001', offerName: 'Daily Deal 1', pricePoint: 80, enabled: true },
  { offerId: 'D002', offerName: 'Daily Deal 2', pricePoint: 120, enabled: true },
];

const OfferConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('offerDetails');

  // Offer Setup form state
  const [offerId, setOfferId] = useState('');
  const [offerName, setOfferName] = useState('');
  const [itemSelection, setItemSelection] = useState('');
  const [itemCount, setItemCount] = useState<number>(0);
  const [iapEnabled, setIapEnabled] = useState(false);
  const [iapAmount, setIapAmount] = useState<number>(0);
  const [hardCurrencyType, setHardCurrencyType] = useState('');
  const [hardCurrencyAmount, setHardCurrencyAmount] = useState<number>(0);
  const [timeSet, setTimeSet] = useState('');
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [offerCategory, setOfferCategory] = useState('');
  const [offerTag, setOfferTag] = useState('');

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadImage(e.target.files[0]);
    }
  };

  const handleSaveOfferSetup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Dummy save handler for the Offer Setup form
    console.log('Offer Setup Saved', {
      offerId,
      offerName,
      itemSelection,
      itemCount,
      iapEnabled,
      iapAmount,
      hardCurrencyType,
      hardCurrencyAmount,
      timeSet,
      uploadImage,
      offerCategory,
      offerTag,
    });
  };

  return (
    <div className="cards-outer">
      <div className="users-table-div p-3">
        <Tabs
          id="offer-config-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || 'offerDetails')}
          className="mb-3"
        >
          <Tab eventKey="offerDetails" title="Offer Details">
            <h5>Combo Offers</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Offer ID</th>
                  <th>Offer Name</th>
                  <th>Price Point</th>
                  <th>Enable/Disable</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {dummyComboOffers.map((offer, index) => (
                  <tr key={index}>
                    <td>{offer.offerId}</td>
                    <td>{offer.offerName}</td>
                    <td>{offer.pricePoint}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`combo-switch-${index}`}
                        checked={offer.enabled}
                        // Add your onChange logic here
                      />
                    </td>
                    <td>
                      <Button variant="danger" size="sm">
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <h5 className="mt-4">Daily Deals</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Offer ID</th>
                  <th>Offer Name</th>
                  <th>Price Point</th>
                  <th>Enable/Disable</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {dummyDailyDeals.map((offer, index) => (
                  <tr key={index}>
                    <td>{offer.offerId}</td>
                    <td>{offer.offerName}</td>
                    <td>{offer.pricePoint}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        id={`daily-switch-${index}`}
                        checked={offer.enabled}
                        // Add your onChange logic here
                      />
                    </td>
                    <td>
                      <Button variant="danger" size="sm">
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="offerSetup" title="Offer Setup">
            <Form onSubmit={handleSaveOfferSetup}>
              <Form.Group className="mb-3" controlId="formOfferId">
                <Form.Label>Offer ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Offer ID"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formOfferName">
                <Form.Label>Offer Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Offer Name"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formItemSelection">
                <Form.Label>Item Selection</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Item Selection"
                  value={itemSelection}
                  onChange={(e) => setItemSelection(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formItemCount">
                <Form.Label>Item Count</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Item Count"
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                />
              </Form.Group>

              <h5>Price Point Set</h5>
              <Form.Group className="mb-3" controlId="formIAP">
                <Form.Check
                  type="checkbox"
                  label="IAP"
                  checked={iapEnabled}
                  onChange={(e) => setIapEnabled(e.target.checked)}
                />
                {iapEnabled && (
                  <Form.Control
                    type="number"
                    placeholder="Enter IAP Amount"
                    value={iapAmount}
                    onChange={(e) => setIapAmount(Number(e.target.value))}
                    className="mt-2"
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formHardCurrency">
                <Form.Label>Hard Currency</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Currency Type"
                      value={hardCurrencyType}
                      onChange={(e) => setHardCurrencyType(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Amount"
                      value={hardCurrencyAmount}
                      onChange={(e) => setHardCurrencyAmount(Number(e.target.value))}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTimeSet">
                <Form.Label>Time Set or Lifetime</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Time Set or Lifetime"
                  value={timeSet}
                  onChange={(e) => setTimeSet(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUploadImage">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control type="file" onChange={handleImageUpload} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formOfferCategory">
                <Form.Label>Offer Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Offer Category"
                  value={offerCategory}
                  onChange={(e) => setOfferCategory(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formOfferTag">
                <Form.Label>Offer Tag</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Offer Tag"
                  value={offerTag}
                  onChange={(e) => setOfferTag(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default OfferConfig;
