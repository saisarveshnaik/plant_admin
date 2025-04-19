import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';import DataTable from 'react-data-table-component';
import Endpoints from '../endpoints';

// Define the type for the data (data structure)
interface UserData {
  _id: string;
  username: string;
  playerId: string;
  exp: number;
  coins: number;
  refercode: string;
  leaderboard_point: number;
  rank: number;
  country: string;
  image: string;
  loginType: number;
  platform_type: number;
  deviceName: string;
  deviceModel: string;
  createdAt: string;
}

const Last24hrUsers: React.FC = () => {
  // State for the search query and filtered data
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [data, setData] = useState<UserData[]>([]);

  // Columns for DataTable
  const columns = [
    { name: 'Username', selector: (row: UserData) => row.username, sortable: true },
    { name: 'Player ID', selector: (row: UserData) => row.playerId, sortable: true },
    { name: 'EXP', selector: (row: UserData) => row.exp, sortable: true },
    { name: 'Coins', selector: (row: UserData) => row.coins, sortable: true },
    { name: 'Leaderboard Points', selector: (row: UserData) => row.leaderboard_point, sortable: true },
    { name: 'Rank', selector: (row: UserData) => row.rank, sortable: true },
    { name: 'Device Name', selector: (row: UserData) => row.deviceName, sortable: false },
    { name: 'Device Model', selector: (row: UserData) => row.deviceModel, sortable: false },
    { name: 'Created At', selector: (row: UserData) => new Date(row.createdAt).toLocaleString(), sortable: true },
  ];
  const token = localStorage.getItem('authToken');

  const fetchPlayers = async (search = '') => {
    try {
      const res = await axios.get(`${Endpoints.Dashboard.GET_ALL_PLAYERS}?page=1&limit=100000&search=${search}`, {
        headers: { token: token || '' }
      });
      if (res.data?.status) {
        const players = res.data.data.data;
        setData(players);
        setFilteredData(players);
      }
    } catch (err) {
      console.error('Error fetching players:', err);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  // Handle search input changes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    fetchPlayers(query);
  };

  return (
    <div>
      <input
        className='form-control'
        type="text"
        placeholder="Search by username"
        value={searchQuery}
        onChange={handleSearch}
        style={{
          padding: '10px',
          fontSize: '16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {/* Data Table */}
      <DataTable
        title="Users joined in last 24hrs"
        columns={columns}
        data={filteredData} // Use filtered data for the table
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default Last24hrUsers;
