import React from 'react';
import '../styles/InfoCard.css';
import { Link } from 'react-router-dom';
import Last24hrUsers from './Last24hrUsers';
import CountUp from './CountUp';

const InfoCard: React.FC = () => {
  return (
    <div className="cards-outer">
      <div className="row mt-4">
        {/* Card 1 */}
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
              <img src='icons/user.png' className='icon' />
              <h5 className="card-title"><CountUp endNumber={23676} duration={3000} /></h5>
              <p className="card-text">TOTAL USERS</p>
              <Link to="/view-users">
                <button className="btn btn-primary">VIEW TOTAL USERS</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
            <img src='icons/user.png' className='icon' />
              <h5 className="card-title"><CountUp endNumber={3455} duration={3000} /></h5>
              <p className="card-text">Daily active users</p>
              <Link to="">
                <button className="btn btn-primary">VIEW ACTIVE USERS</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
            <img src='icons/downloads.png' className='icon' />
              <h5 className="card-title"><CountUp endNumber={44567} duration={3000} /></h5>
              <p className="card-text">Total Downloads</p>
              <Link to="">
                <button className="btn btn-primary">VIEW INFO</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
            <img src='icons/revenue.png' className='icon' />
              <h5 className="card-title">₹<CountUp endNumber={887675} duration={3000} /></h5>
              <p className="card-text">Android Revenue</p>
              <Link to="">
                <button className="btn btn-primary">View Info</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
            <img src='icons/revenue.png' className='icon' />
              <h5 className="card-title">₹<CountUp endNumber={457675} duration={3000} /></h5>
              <p className="card-text">IOS revenue</p>
              <Link to="">
                <button className="btn btn-primary">View Info</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
            <img src='icons/revenue.png' className='icon' />
              <h5 className="card-title">₹<CountUp endNumber={4675} duration={3000} /></h5>
              <p className="card-text">Daily Total Revenue</p>
              <Link to="">
                <button className="btn btn-primary">View Info</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
            <img src='icons/revenue.png' className='icon' />
              <h5 className="card-title">₹<CountUp endNumber={9967675} duration={3000} /></h5>
              <p className="card-text">Total Revenue</p>
              <Link to="">
                <button className="btn btn-primary">View Info</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body card1">
            <img src='icons/leaderboard.png' className='icon' />
              <h5 className="card-title">Leaderboard</h5>
              <p className="card-text">Learders of the game</p>
              <Link to="">
                <button className="btn btn-primary">View Leaderbord</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    
    <div className='users-table-div'>
    <Last24hrUsers />
    </div>


    </div>
  );
};

export default InfoCard;
