const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite Database - use /app/data for Railway volume persistence
const fs = require('fs');
const dbPath = process.env.RAILWAY_ENVIRONMENT ? '/app/data/cookout.db' : './cookout.db';

// Ensure directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS food_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guest_id INTEGER NOT NULL,
    item TEXT NOT NULL,
    claimed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(id)
  );
  
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ============ API ROUTES ============

// Get all guests
app.get('/api/guests', (req, res) => {
  const guests = db.prepare('SELECT * FROM guests ORDER BY id').all();
  res.json(guests);
});

// Add a new guest
app.post('/api/guests', (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const stmt = db.prepare('INSERT INTO guests (name) VALUES (?)');
  const result = stmt.run(name.trim());
  
  res.json({ 
    id: result.lastInsertRowid, 
    name: name.trim(),
    message: 'Guest added successfully!' 
  });
});

// Delete a guest
app.delete('/api/guests/:id', (req, res) => {
  const { id } = req.params;
  
  // Delete associated food items first
  db.prepare('DELETE FROM food_items WHERE guest_id = ?').run(id);
  // Delete the guest
  db.prepare('DELETE FROM guests WHERE id = ?').run(id);
  
  res.json({ message: 'Guest removed successfully' });
});

// Get all food items with guest names
app.get('/api/food', (req, res) => {
  const items = db.prepare(`
    SELECT f.id, f.item, f.claimed, g.name as guest_name, g.id as guest_id
    FROM food_items f
    JOIN guests g ON f.guest_id = g.id
    ORDER BY f.id
  `).all();
  res.json(items);
});

// Add a food item
app.post('/api/food', (req, res) => {
  const { guest_id, item } = req.body;
  
  if (!guest_id || !item || item.trim() === '') {
    return res.status(400).json({ error: 'Guest ID and item are required' });
  }
  
  // Verify guest exists
  const guest = db.prepare('SELECT * FROM guests WHERE id = ?').get(guest_id);
  if (!guest) {
    return res.status(404).json({ error: 'Guest not found' });
  }
  
  const stmt = db.prepare('INSERT INTO food_items (guest_id, item) VALUES (?, ?)');
  const result = stmt.run(guest_id, item.trim());
  
  res.json({ 
    id: result.lastInsertRowid, 
    guest_id,
    item: item.trim(),
    guest_name: guest.name,
    message: 'Food item added successfully!' 
  });
});

// Toggle food item claimed status (strikethrough)
app.patch('/api/food/:id/toggle', (req, res) => {
  const { id } = req.params;
  
  const item = db.prepare('SELECT claimed FROM food_items WHERE id = ?').get(id);
  if (!item) {
    return res.status(404).json({ error: 'Food item not found' });
  }
  
  const newStatus = item.claimed ? 0 : 1;
  db.prepare('UPDATE food_items SET claimed = ? WHERE id = ?').run(newStatus, id);
  
  res.json({ id, claimed: newStatus });
});

// Delete a food item
app.delete('/api/food/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM food_items WHERE id = ?').run(id);
  res.json({ message: 'Food item removed successfully' });
});

// ============ COMMENTS API ============

// Get all comments
app.get('/api/comments', (req, res) => {
  const comments = db.prepare('SELECT * FROM comments ORDER BY created_at DESC').all();
  res.json(comments);
});

// Add a comment
app.post('/api/comments', (req, res) => {
  const { name, message } = req.body;
  
  if (!name || name.trim() === '' || !message || message.trim() === '') {
    return res.status(400).json({ error: 'Name and message are required' });
  }
  
  const stmt = db.prepare('INSERT INTO comments (name, message) VALUES (?, ?)');
  const result = stmt.run(name.trim(), message.trim());
  
  res.json({ 
    id: result.lastInsertRowid, 
    name: name.trim(),
    message: message.trim(),
    created_at: new Date().toISOString()
  });
});

// Delete a comment
app.delete('/api/comments/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM comments WHERE id = ?').run(id);
  res.json({ message: 'Comment removed successfully' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🍖 Family Cookout RSVP server running on port ${PORT}`);
  console.log(`   Open http://localhost:${PORT} in your browser`);
});
