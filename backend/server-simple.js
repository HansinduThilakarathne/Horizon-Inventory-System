const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'horizon_super_secret_key_2026';
const PORT = process.env.PORT || 5000;

// In-memory data store (simulates MongoDB for development)
let users = [];
let inventory = [];
let messages = [];
let requests = [];

// Load data from files if they exist
const loadData = () => {
  try {
    const usersFile = path.join(__dirname, 'data', 'users.json');
    const inventoryFile = path.join(__dirname, 'data', 'inventory.json');
    const messagesFile = path.join(__dirname, 'data', 'messages.json');
    const requestsFile = path.join(__dirname, 'data', 'requests.json');
    
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
      fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
    }
    
    if (fs.existsSync(usersFile)) users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    if (fs.existsSync(inventoryFile)) inventory = JSON.parse(fs.readFileSync(inventoryFile, 'utf8'));
    if (fs.existsSync(messagesFile)) messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
    if (fs.existsSync(requestsFile)) requests = JSON.parse(fs.readFileSync(requestsFile, 'utf8'));
  } catch (err) {
    console.log('📝 Starting with empty data stores');
  }
};

// Save data to files
const saveData = () => {
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(dataDir, 'inventory.json'), JSON.stringify(inventory, null, 2));
  fs.writeFileSync(path.join(dataDir, 'messages.json'), JSON.stringify(messages, null, 2));
  fs.writeFileSync(path.join(dataDir, 'requests.json'), JSON.stringify(requests, null, 2));
};

loadData();

// ==========================================
// 1. AUTHENTICATION APIs
// ==========================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const existing = users.find(u => u.email === email);
    if (existing) return res.status(400).json({ error: 'Email already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: Date.now().toString(),
      name,
      email,
      phone,
      role,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(newUser);
    saveData();

    res.status(201).json({ message: 'User successfully registered!' });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.role !== role) {
      return res.status(403).json({ error: `Access Denied. You are not registered as an ${role}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role, email: user.email, name: user.name });
  } catch (err) { 
    res.status(500).json({ error: err.message }); 
  }
});

// ==========================================
// 2. INVENTORY APIs
// ==========================================
app.get('/api/inventory', async (req, res) => {
  try {
    res.json(inventory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const item = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    inventory.push(item);
    saveData();
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    inventory = inventory.filter(i => i._id !== req.params.id);
    saveData();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const index = inventory.findIndex(i => i._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Item not found' });
    inventory[index] = { ...inventory[index], ...req.body };
    saveData();
    res.json(inventory[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 3. MESSAGES APIs
// ==========================================
app.get('/api/messages', async (req, res) => {
  try {
    res.json(messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages', async (req, res) => {
  try {
    const msg = {
      _id: Date.now().toString(),
      ...req.body,
      status: 'Unread',
      createdAt: new Date()
    };
    messages.push(msg);
    saveData();
    res.status(201).json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 4. REQUESTS APIs
// ==========================================
app.get('/api/requests', async (req, res) => {
  try {
    res.json(requests);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/requests', async (req, res) => {
  try {
    const newRequest = {
      _id: Date.now().toString(),
      ...req.body
    };
    requests.push(newRequest);
    saveData();
    res.status(201).json(newRequest);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/requests/:id', async (req, res) => {
  try {
    const index = requests.findIndex(r => r._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Request not found' });
    requests[index] = { ...requests[index], ...req.body };
    saveData();
    res.json(requests[index]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => {
  console.log(`✅ Backend Server running at http://localhost:${PORT}`);
  console.log(`💾 Using JSON file storage (data/users.json, data/inventory.json, data/messages.json, data/requests.json)`);
});
