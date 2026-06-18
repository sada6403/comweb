import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { DatabaseSync } from 'node:sqlite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Setup SQLite database
const db = new DatabaseSync('database.sqlite');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT,
    summary TEXT,
    price_label TEXT,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    service TEXT,
    rating INTEGER,
    text TEXT
  );

  CREATE TABLE IF NOT EXISTS company (
    id INTEGER PRIMARY KEY,
    name TEXT,
    tagline TEXT,
    about TEXT,
    email TEXT,
    location TEXT,
    whatsapp TEXT
  );
`);

// Check if company is seeded
const companyCount = db.prepare('SELECT COUNT(*) as count FROM company').get().count;
if (companyCount === 0) {
  const insertCompany = db.prepare(`
    INSERT INTO company (id, name, tagline, about, email, location, whatsapp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertCompany.run(
    1,
    'YourCompany',
    'Software, built around how your business actually runs.',
    'We are a small team of developers and designers based in Sri Lanka, building websites, apps, and internal tools for businesses that are tired of off-the-shelf software that almost fits.',
    'hello@yourcompany.lk',
    'Colombo, Sri Lanka',
    '94770000000'
  );

  const insertService = db.prepare('INSERT INTO services (id, title, summary, price_label, icon) VALUES (?, ?, ?, ?, ?)');
  insertService.run('s1', 'Web development', 'Business websites and web apps built with React, PHP, or Laravel.', 'From LKR 25,000', 'code');
  insertService.run('s2', 'UI / UX design', 'Modern interfaces focused on clean typography and easy navigation.', 'From LKR 12,000', 'layout');
  insertService.run('s3', 'Internal tools', 'Custom dashboards and databases to replace messy spreadsheets.', 'Custom pricing', 'database');

  const insertReview = db.prepare('INSERT INTO reviews (id, name, role, service, rating, text) VALUES (?, ?, ?, ?, ?, ?)');
  insertReview.run('r1', 'Kasun Perera', 'Owner, ABC Traders', 'Web development', 5, 'They delivered exactly what we needed. Communication was clear from day one.');
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey', (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// API Routes

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '24h' });
    return res.json({ access_token: token });
  }
  return res.status(400).json({ error_description: 'Invalid login credentials' });
});

// Services API
app.get('/api/services', (req, res) => {
  const rows = db.prepare('SELECT * FROM services ORDER BY id').all();
  res.json(rows);
});

app.post('/api/services', authenticateToken, (req, res) => {
  const { id, title, summary, price_label, icon } = req.body;
  const newId = id || `s${Date.now()}`;
  const insert = db.prepare('INSERT INTO services (id, title, summary, price_label, icon) VALUES (?, ?, ?, ?, ?)');
  insert.run(newId, title, summary, price_label, icon);
  const row = db.prepare('SELECT * FROM services WHERE id = ?').get(newId);
  res.json(row);
});

app.put('/api/services/:id', authenticateToken, (req, res) => {
  const { title, summary, price_label, icon } = req.body;
  const update = db.prepare('UPDATE services SET title = ?, summary = ?, price_label = ?, icon = ? WHERE id = ?');
  const info = update.run(title, summary, price_label, icon, req.params.id);
  
  if (info.changes === 0) {
    // If updating a demo service that isn't in DB yet, insert it
    const insert = db.prepare('INSERT INTO services (id, title, summary, price_label, icon) VALUES (?, ?, ?, ?, ?)');
    insert.run(req.params.id, title, summary, price_label, icon);
  }
  
  const row = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
  res.json(row || {});
});

app.delete('/api/services/:id', authenticateToken, (req, res) => {
  const del = db.prepare('DELETE FROM services WHERE id = ?');
  del.run(req.params.id);
  res.status(204).send();
});

// Reviews API
app.get('/api/reviews', (req, res) => {
  const rows = db.prepare('SELECT * FROM reviews ORDER BY id').all();
  res.json(rows);
});

app.post('/api/reviews', authenticateToken, (req, res) => {
  const { id, name, role, service, rating, text } = req.body;
  const newId = id || `r${Date.now()}`;
  const insert = db.prepare('INSERT INTO reviews (id, name, role, service, rating, text) VALUES (?, ?, ?, ?, ?, ?)');
  insert.run(newId, name, role, service, rating, text);
  const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(newId);
  res.json(row);
});

app.put('/api/reviews/:id', authenticateToken, (req, res) => {
  const { name, role, service, rating, text } = req.body;
  const update = db.prepare('UPDATE reviews SET name = ?, role = ?, service = ?, rating = ?, text = ? WHERE id = ?');
  const info = update.run(name, role, service, rating, text, req.params.id);
  
  if (info.changes === 0) {
    const insert = db.prepare('INSERT INTO reviews (id, name, role, service, rating, text) VALUES (?, ?, ?, ?, ?, ?)');
    insert.run(req.params.id, name, role, service, rating, text);
  }

  const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  res.json(row || {});
});

app.delete('/api/reviews/:id', authenticateToken, (req, res) => {
  const del = db.prepare('DELETE FROM reviews WHERE id = ?');
  del.run(req.params.id);
  res.status(204).send();
});

// Company API
app.get('/api/company', (req, res) => {
  const row = db.prepare('SELECT * FROM company WHERE id = 1').get();
  res.json(row ? [row] : []);
});

app.put('/api/company', authenticateToken, (req, res) => {
  const { name, tagline, about, email, location, whatsapp } = req.body;
  const update = db.prepare('UPDATE company SET name = ?, tagline = ?, about = ?, email = ?, location = ?, whatsapp = ? WHERE id = 1');
  update.run(name, tagline, about, email, location, whatsapp);
  const row = db.prepare('SELECT * FROM company WHERE id = 1').get();
  res.json(row ? [row] : []);
});

// Serve frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server is successfully running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use. Trying port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error(err);
    }
  });
};

startServer(PORT);
