// InfoCard.tsx
import React from 'react';
import '../styles/InfoCard.css';
import { useNavigate, Link } from 'react-router-dom';

const InfoCard: React.FC = () => {
  return (
    <div className="container">
      <div className="row mt-4">
        {/* Card 1 */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            {/* <img
              src="https://via.placeholder.com/350x200"  
              alt="Card 1"
              className="card-img-top"
            /> */}
            <div className="card-body card1">
              <h5 className="card-title">26</h5>
              <p className="card-text">
              Total Blogs Added
              </p>
              <Link to="/add-big-blog">
              <a href="#" className="btn btn-primary">Add More</a>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        {/* <div className="col-md-3 ">
          <div className="card shadow-sm">
            <div className="card-body card2">
              <h5 className="card-title">$6.200 </h5>
              <p className="card-text">
              Admin Income
              </p>
              <a href="#" className="btn btn-primary">View</a>
            </div>
          </div>
        </div> */}

        {/* Card 3 */}
        {/* <div className="col-md-3 ">
          <div className="card shadow-sm">
            <div className="card-body card3">
              <h5 className="card-title">$4456.200</h5>
              <p className="card-text">
              Total User Earnings
              </p>
              <a href="#" className="btn btn-primary">View</a>
            </div>
          </div>
        </div> */}

        {/* Card 4 */}
        {/* <div className="col-md-3 ">
          <div className="card shadow-sm">
            <div className="card-body card4">
              <h5 className="card-title">44</h5>
              <p className="card-text">
              Payouts Sent
              </p>
              <a href="#" className="btn btn-primary">View</a>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
};

export default InfoCard;