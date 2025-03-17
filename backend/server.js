// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Mock data for presentation
const mockData = {
  stakes: [
    { 
      id: 1, 
      title: 'Morning Run Challenge', 
      amount: 50, 
      participants: ['John', 'Alice', 'Bob'],
      description: 'Run 5km every morning for a week',
      status: 'active',
      trending: true
    },
    { 
      id: 2, 
      title: 'Weight Loss Challenge', 
      amount: 100, 
      participants: ['Mike', 'Sarah', 'Tom', 'Lisa', 'Alex'],
      description: 'Lose 5kg in 30 days',
      status: 'active',
      trending: true
    },
    { 
      id: 3, 
      title: 'Study Group Challenge', 
      amount: 30, 
      participants: ['Emma', 'David', 'Sophie', 'James'],
      description: 'Complete 3 coding courses',
      status: 'completed',
      trending: false
    }
  ]
};

// Routes for demo
// Get all stakes
app.get('/api/stakes', (req, res) => {
  res.json(mockData.stakes);
});

// Get trending stakes
app.get('/api/stakes/trending', (req, res) => {
  const trendingStakes = mockData.stakes.filter(stake => stake.trending);
  res.json(trendingStakes);
});

// Get stake by ID
app.get('/api/stakes/:id', (req, res) => {
  const stake = mockData.stakes.find(s => s.id === parseInt(req.params.id));
  if (!stake) return res.status(404).json({ message: 'Stake not found' });
  res.json(stake);
});

// Create new stake
app.post('/api/stakes', (req, res) => {
  const newStake = {
    id: mockData.stakes.length + 1,
    ...req.body,
    participants: [req.body.creator || 'Anonymous'],
    status: 'active',
    trending: false
  };
  mockData.stakes.push(newStake);
  res.json(newStake);
});

// Join stake
app.post('/api/stakes/:id/join', (req, res) => {
  const stake = mockData.stakes.find(s => s.id === parseInt(req.params.id));
  if (!stake) return res.status(404).json({ message: 'Stake not found' });
  
  const participant = req.body.participant || 'Anonymous';
  if (!stake.participants.includes(participant)) {
    stake.participants.push(participant);
  }
  res.json(stake);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});