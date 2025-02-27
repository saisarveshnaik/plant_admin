import React from 'react';
import ListTransactionDetails from '../components/ListTransactionDetails';

const TransactionDetails: React.FC = () => {
  return (
    <div className="cards-outer">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Transaction Details</h5>
          <div className="row align-items-center mb-4">
            <div className="col-md-2">
              <label>Select Country:</label>
              <select className="form-control form-select">
                <option value="">Country</option>
                <option value="USA">USA</option>
                <option value="India">India</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div className="col-md-3">
            <label>Search Filter:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search for id, email, amount, packs, SKU's"
              />
              {/* <small className="form-text text-muted">
                Search field for ID's, Emails, Amounts, Packs, and SKUs
              </small> */}
            </div>

            <div className="col-md-3">
              <label>Select Platform:</label>
              <select className="form-control form-select">
                <option value="android">Android</option>
                <option value="ios">IOS</option>
              </select>
            </div>

            <div className="col-md-4 justify-content-end">
              <div className="btn-group">
                <button className="btn btn-outline-secondary">Days</button>
                <button className="btn btn-outline-secondary">Months</button>
                <button className="btn btn-outline-secondary">Years</button>
              </div>
              <div className='d-flex'>
              <input
                type="text"
                className="form-control"
                placeholder="15/01/2025 - 22/01/2025"
              />
              <button className='btn btn-outline-secondary'>PRINT</button>
              <button className='btn btn-outline-secondary'>SAVE</button>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="card-subtitle mb-2 text-muted">Total Paying Users</h6>
                  <h4 className="card-title">8</h4>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="card-subtitle mb-2 text-muted">Total Revenue</h6>
                  <h4 className="card-title">$XXXX</h4>
                </div>
              </div>
            </div>
          </div>
           
        <div className='users-table-div'>
        <ListTransactionDetails />
        </div>

        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
