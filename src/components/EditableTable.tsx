import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

// Define a type for a player (update the fields as needed)
interface Player {
  id: number;
  playerId: string;
  name: string;
  email: string;
  mobile: string;
  deviceType: string;
  kycStatus: string;
  registeredDate: string;
}

// Sample initial data
const initialData: Player[] = [
  {
    id: 1,
    playerId: 'P001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '1234567890',
    deviceType: 'Android',
    kycStatus: 'Verified',
    registeredDate: '2023-01-01',
  },
  {
    id: 2,
    playerId: 'P002',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobile: '0987654321',
    deviceType: 'iOS',
    kycStatus: 'Pending',
    registeredDate: '2023-02-15',
  },
];

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

interface EditPlayerDialogProps {
  open: boolean;
  player: Player | null;
  onClose: () => void;
  onSave: (player: Player) => void;
}

const EditPlayerDialog: React.FC<EditPlayerDialogProps> = ({ open, player, onClose, onSave }) => {
  // Maintain local state for the editing player details
  const [editPlayer, setEditPlayer] = useState<Player | null>(player);
  const [tabIndex, setTabIndex] = useState(0);

  // Update state when the passed "player" prop changes
  React.useEffect(() => {
    setEditPlayer(player);
  }, [player]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editPlayer) {
      setEditPlayer({ ...editPlayer, [e.target.name]: e.target.value });
    }
  };

  // Handle saving the changes
  const handleSave = () => {
    if (editPlayer) {
      onSave(editPlayer);
    }
  };

  if (!editPlayer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Player</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Edit player tabs">
          <Tab label="Home" />
          <Tab label="KYC Player" />
          <Tab label="Bank Details" />
          <Tab label="Notification" />
        </Tabs>
        {/* Home Tab */}
        <TabPanel value={tabIndex} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="playerId"
              label="Player ID"
              value={editPlayer.playerId}
              onChange={handleChange}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField name="name" label="Player Name" value={editPlayer.name} onChange={handleChange} fullWidth />
            <TextField name="email" label="Email" value={editPlayer.email} onChange={handleChange} fullWidth />
            <TextField name="mobile" label="Mobile Number" value={editPlayer.mobile} onChange={handleChange} fullWidth />
          </Box>
        </TabPanel>
        {/* KYC Player Tab */}
        <TabPanel value={tabIndex} index={1}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField name="kycStatus" label="KYC Status" value={editPlayer.kycStatus} onChange={handleChange} fullWidth />
            {/* Add any additional fields as per the original UI */}
            <TextField name="kycDocumentNumber" label="KYC Document Number" onChange={handleChange} fullWidth />
            <TextField name="kycDocumentType" label="KYC Document Type" onChange={handleChange} fullWidth />
          </Box>
        </TabPanel>
        {/* Bank Details Tab */}
        <TabPanel value={tabIndex} index={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField name="bankName" label="Bank Name" onChange={handleChange} fullWidth />
            <TextField name="accountNumber" label="Account Number" onChange={handleChange} fullWidth />
            <TextField name="ifscCode" label="IFSC Code" onChange={handleChange} fullWidth />
          </Box>
        </TabPanel>
        {/* Notification Tab */}
        <TabPanel value={tabIndex} index={3}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField name="notificationEmail" label="Notification Email" onChange={handleChange} fullWidth />
            <TextField name="notificationPhone" label="Notification Phone" onChange={handleChange} fullWidth />
            <TextField name="notificationStatus" label="Notification Status" onChange={handleChange} fullWidth />
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PlayerList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(initialData);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [kycFilter, setKycFilter] = useState('All');
  const [deviceFilter, setDeviceFilter] = useState('All');

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

  const handleEditClick = (player: Player) => {
    setSelectedPlayer(player);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleDialogClose = () => {
    setSelectedPlayer(null);
    setEditDialogOpen(false);
  };

  const handleDialogSave = (updatedPlayer: Player) => {
    setPlayers(players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)));
    handleDialogClose();
  };

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

      {/* Player Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Player ID</TableCell>
              <TableCell>Player Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Device Type</TableCell>
              <TableCell>KYC Status</TableCell>
              <TableCell>Registered Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.playerId}</TableCell>
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.email}</TableCell>
                <TableCell>{player.mobile}</TableCell>
                <TableCell>{player.deviceType}</TableCell>
                <TableCell>{player.kycStatus}</TableCell>
                <TableCell>{player.registeredDate}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEditClick(player)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(player.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredPlayers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Player Dialog */}
      <EditPlayerDialog
        open={editDialogOpen}
        player={selectedPlayer}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
      />
    </Box>
  );
};

export default PlayerList;
