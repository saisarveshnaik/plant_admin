// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import InfoCard from './components/InfoCard';
import LoginPage from './page/LoginPage';
import SignupPage from './page/SignupPage';
import AddAdmin from './page/AddAdmin';
import ViewAdmin from './page/ViewAdmin';
import ViewUsers from './page/ViewUsers';
import UserAccess from './page/UserAccess';
import TransactionDetails from './page/TransactionDetails';
import ProgressionConfig from './page/ProgressionConfig';
import DailyRewards from './page/DailyRewardConfig';
import SpinWheel from './page/SpinWheel';
import DailyTasks from './page/DailyTasks';
import Achievements from './page/Achievements';
import PlantConfig from './page/PlantConfig';
import OfferConfig from './page/OfferConfig';
import PuzzleConfig from './page/PuzzleConfig';


import GameVersion from './page/GameVersion';
import GameSettings from './page/GameSettings';
import PlayerPlant from './page/PlayerPlant';
import GiftBox from './page/GiftBox';
import FreeAdRewards from './page/FreeAdRewards';
import SocialRewards from './page/SocialRewards';
import LevelCompleteRewards from './page/LevelCompleteRewards';
import InAppPurchase from './page/InAppPurchase';
import InAppPurchaseHistory from './page/InAppPurchaseHistory';
import AchievementCollect from './page/AchievementCollect';

import Logout from "./page/Logout";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Router>
      <Routes>
        {/* Login Page Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Other Pages */}
        <Route
          path="*"
          element={
            <div className="app-container d-flex">
              {/* Sidebar */}
              <div className={`sidebar ${isSidebarOpen ? '' : 'sidebar-hidden'}`}>
                <Sidebar />
              </div>

              {/* Main content area */}
              <div className={`main-content d-flex flex-column ${isSidebarOpen ? 'content-with-sidebar' : 'content-full'}`}>
                {/* Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                {/* Content */}
                <div className="content-area flex-grow-1">
                  <Routes>
                    <Route path="/" element={<><div className="info-cards"><InfoCard /></div></>}/>
                    <Route path="/add-admin" element={<AddAdmin />} />
                    <Route path="/view-admin" element={<ViewAdmin />} />
                    <Route path="/view-users" element={<ViewUsers />} />
                    <Route path="/user-access" element={<UserAccess />} />
                    <Route path="/transaction-details" element={<TransactionDetails />} />
                    <Route path="/progression-config" element={<ProgressionConfig />} />
                    <Route path="/daily-rewards-config" element={<DailyRewards />} />
                    <Route path="/spinwheel" element={<SpinWheel />} />
                    <Route path="/daily-tasks" element={<DailyTasks />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/plant-config" element={<PlantConfig />} />
                    <Route path="/offer-config" element={<OfferConfig />} />
                    <Route path="/puzzle-config" element={<PuzzleConfig />} />
                    <Route path="/game-version" element={<GameVersion />} />
                    <Route path="/game-settings" element={<GameSettings />} />
                    <Route path="/player-plant" element={<PlayerPlant />} />
                    <Route path="/gift-box" element={<GiftBox />} />
                    <Route path="/free-ad-rewards" element={<FreeAdRewards />} />
                    <Route path="/social-rewards" element={<SocialRewards />} />
                    <Route path="/level-complete-rewards" element={<LevelCompleteRewards />} />
                    <Route path="/in-app-purchase" element={<InAppPurchase />} />
                    <Route path="/in-app-purchase-history" element={<InAppPurchaseHistory />} />
                    <Route path="/achievement-collect" element={<AchievementCollect />} />
                    <Route path="/logout" element={<Logout />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
