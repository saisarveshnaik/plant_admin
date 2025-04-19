import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from '../utils/axiosInstance';import Endpoints from '../endpoints';
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  TablePagination,
  Chip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import '../styles/InfoCard.css';
import BlockIcon from '@mui/icons-material/Block'; // For Ban Player button
import { CSVLink } from 'react-csv';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Checkbox from '@mui/material/Checkbox';

// Define a type for a player (update the fields as needed)
interface Player {
  id: string;
  playerId: string;
  name: string;
  email: string;
  mobile: string;
  deviceType: string;
  kycStatus: string;
  registeredDate: string;
}



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Simple TabPanel helper component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`edit-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

interface EditPlayerPageProps {
  player: Player;
  onSave: (player: Player) => void;
  onCancel: () => void;
}

const EditPlayerPage: React.FC<EditPlayerPageProps> = ({ player, onSave, onCancel }) => {
  // Maintain local state for the editing player details
  const [editPlayer, setEditPlayer] = useState<Player>(player);
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // For Home tab, do not allow editing.
    if (tabIndex === 0) return;
    setEditPlayer({ ...editPlayer, [e.target.name]: e.target.value });
  };

  // Handle saving the changes
  const handleSave = () => {
    onSave(editPlayer);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Player
      </Typography>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Edit player tabs">
        <Tab label="Home" />
        <Tab label="KYC Player" />
        <Tab label="Bank Details" />
        <Tab label="Notification" />
      </Tabs>
      {/* Home Tab (Read-only) */}
      <TabPanel value={tabIndex} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="playerId"
            label="Player ID"
            value={editPlayer.playerId}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="name"
            label="Player Name"
            value={editPlayer.name}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="email"
            label="Email"
            value={editPlayer.email}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            name="mobile"
            label="Mobile Number"
            value={editPlayer.mobile}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Box>
      </TabPanel>
      {/* KYC Player Tab */}
      <TabPanel value={tabIndex} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="kycStatus"
            label="KYC Status"
            value={editPlayer.kycStatus}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="kycDocumentNumber"
            label="KYC Document Number"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="kycDocumentType"
            label="KYC Document Type"
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </TabPanel>
      {/* Bank Details Tab */}
      <TabPanel value={tabIndex} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="bankName"
            label="Bank Name"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="accountNumber"
            label="Account Number"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="ifscCode"
            label="IFSC Code"
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </TabPanel>
      {/* Notification Tab */}
      <TabPanel value={tabIndex} index={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="notificationEmail"
            label="Notification Email"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="notificationPhone"
            label="Notification Phone"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="notificationStatus"
            label="Notification Status"
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </TabPanel>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button onClick={onCancel}>Back</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
};

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState('All');
  const [deviceFilter, setDeviceFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredPlayers.map((player) => player.id);
      setSelectedIds(newSelected);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const fetchPlayers = async () => {
      try {
        const res = await axios.get(`${Endpoints.Dashboard.GET_ALL_PLAYERS}?page=${page}&limit=${rowsPerPage}&search=`, {
          headers: { token: token || '' }
        });
        if (res.data?.status) {
          const playersData = res.data.data.data.map((p: any, index: number) => ({
            id: (page - 1) * rowsPerPage + index + 1,
            playerId: p.playerId || '',
            name: p.username || '',
            email: '', // no email in response
            mobile: '', // no mobile in response
            deviceType: p.platform_type === 0 ? 'Android' : p.platform_type === 1 ? 'iOS' : 'Web',
            kycStatus: 'Pending', // placeholder as not in response
            registeredDate: new Date(p.createdAt).toLocaleDateString(),
          }));
          setPlayers(playersData);
          setTotalPlayers(res.data.data.totalPlayers || 0);
        }
      } catch (err) {
        console.error('Failed to fetch player data', err);
      }
    };

    fetchPlayers();
  }, [page, rowsPerPage]);
  
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      // refetch or filter data
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Handle search term change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle KYC filter change
  const handleKycFilterChange = (e: SelectChangeEvent<string>) => {
    setKycFilter(e.target.value);
  };

  // Handle device type filter change
  const handleDeviceFilterChange = (e: SelectChangeEvent<string>) => {
    setDeviceFilter(e.target.value);
  };

  // Filter players based on search and filters
  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKyc = kycFilter === 'All' || p.kycStatus === kycFilter;
    const matchesDevice = deviceFilter === 'All' || p.deviceType === deviceFilter;
    return matchesSearch && matchesKyc && matchesDevice;
  });

  const csvHeaders = [
    { label: 'Player ID', key: 'playerId' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'Device Type', key: 'deviceType' },
    { label: 'KYC Status', key: 'kycStatus' },
    { label: 'Registered Date', key: 'registeredDate' },
  ];

  const csvData = filteredPlayers.filter((p) => selectedIds.includes(p.id));

  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
  };

  const handleDeleteClick = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleBanClick = (id: string) => {
    // Implement ban logic here. For example, update the player's status or remove from the list.
    console.log(`Ban player with id ${id}`);
  };

  const handleSaveEdit = (updatedPlayer: Player) => {
    setPlayers(players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)));
    setEditingPlayer(null);
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
  };

  // If an editing player is selected, render the edit page instead of the list.
  if (editingPlayer) {
    return (
      <EditPlayerPage
        player={editingPlayer}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Player List
      </Typography>

      {/* Top Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="kyc-filter-label">KYC Status</InputLabel>
          <Select
            labelId="kyc-filter-label"
            value={kycFilter}
            label="KYC Status"
            onChange={handleKycFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="device-filter-label">Device Type</InputLabel>
          <Select
            labelId="device-filter-label"
            value={deviceFilter}
            label="Device Type"
            onChange={handleDeviceFilterChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Android">Android</MenuItem>
            <MenuItem value="iOS">iOS</MenuItem>
            <MenuItem value="Web">Web</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Actions Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, totalPlayers)} of {totalPlayers} results
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            disabled={selectedIds.length === 0}
            variant="outlined"
            color="error"
            onClick={() => {
              setPlayers((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
              setSelectedIds([]);
            }}
          >
            Delete Selected
          </Button>
          <CSVLink data={csvData} headers={csvHeaders} filename="selected_players.csv" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" startIcon={<FileDownloadIcon />}>Export CSV</Button>
          </CSVLink>
        </Box>
      </Box>

      {/* Player Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.length > 0 && selectedIds.length === filteredPlayers.length}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < filteredPlayers.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Player ID</TableCell>
              <TableCell>Player Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Device Type</TableCell>
              <TableCell>KYC Status</TableCell>
              <TableCell>Registered Date</TableCell>
              <TableCell align="center">Actions</TableCell>
              <TableCell align="center">Ban</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.includes(player.id)}
                    onChange={() => handleSelectOne(player.id)}
                  />
                </TableCell>
                <TableCell>{player.playerId}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.email}</TableCell>
                <TableCell>{player.mobile}</TableCell>
                <TableCell>{player.deviceType}</TableCell>
                <TableCell>
                  <Chip label={player.kycStatus} color={
                    player.kycStatus === 'Verified' ? 'success' :
                      player.kycStatus === 'Pending' ? 'warning' :
                        'error'
                  } />
                </TableCell>
                <TableCell>{player.registeredDate}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEditClick(player)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(player.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleBanClick(player.id)}>
                    <BlockIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredPlayers.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="pagination-container">
        <TablePagination
          component="div"
          count={totalPlayers}
          page={page - 1}
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(1);
          }}
        />
      </Box>
    </Box>
  );
};

export default PlayerList;
