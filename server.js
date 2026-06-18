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
    whatsapp TEXT,
    facebook TEXT,
    instagram TEXT,
    linkedin TEXT
  );

  CREATE TABLE IF NOT EXISTS stats (
    id TEXT PRIMARY KEY,
    number INTEGER,
    suffix TEXT,
    label TEXT
  );

  CREATE TABLE IF NOT EXISTS features (
    id TEXT PRIMARY KEY,
    text TEXT
  );
`);

// Safely add social columns if they don't exist yet (for existing SQLite DBs)
try { db.exec('ALTER TABLE company ADD COLUMN facebook TEXT'); } catch {}
try { db.exec('ALTER TABLE company ADD COLUMN instagram TEXT'); } catch {}
try { db.exec('ALTER TABLE company ADD COLUMN linkedin TEXT'); } catch {}

// Check if company is seeded
const companyCount = db.prepare('SELECT COUNT(*) as count FROM company').get().count;
if (companyCount === 0) {
  // Seed Company
  const insertCompany = db.prepare(`
    INSERT INTO company (id, name, tagline, about, email, location, whatsapp, facebook, instagram, linkedin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertCompany.run(
    1,
    'YourCompany',
    'Software, built around how your business actually runs.',
    'We are a small team of developers and designers based in Sri Lanka, building websites, apps, and internal tools for businesses that are tired of off-the-shelf software that almost fits.',
    'hello@yourcompany.lk',
    'Colombo, Sri Lanka',
    '94770000000',
    '', '', ''
  );

  // Seed Reviews
  const insertReview = db.prepare('INSERT INTO reviews (id, name, role, service, rating, text) VALUES (?, ?, ?, ?, ?, ?)');
  insertReview.run('r1', 'Kasun Perera', 'Owner, ABC Traders', 'Web development', 5, 'They delivered exactly what we needed. Communication was clear from day one.');
}

// Seed Services comprehensively if user only has 1 or 0 services
const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
if (servicesCount <= 1) {
  db.exec('DELETE FROM services');
  const insertService = db.prepare('INSERT INTO services (id, title, summary, price_label, icon) VALUES (?, ?, ?, ?, ?)');
  insertService.run('s1', 'Web Development', 'Business websites and web apps built with React, PHP, or Laravel.', 'From LKR 25,000', 'code');
  insertService.run('s2', 'UI / UX Design', 'Modern interfaces focused on clean typography and easy navigation.', 'From LKR 12,000', 'layout');
  insertService.run('s3', 'Digital Marketing & SEO', 'Data-driven marketing to grow your online presence and sales.', 'Custom pricing', 'database');
  insertService.run('s4', 'Mobile App Development', 'Native and cross-platform apps for iOS and Android.', 'From LKR 40,000', 'device-mobile');
  insertService.run('s5', 'Custom Software & ERP', 'Internal tools, dashboards, and databases to replace messy spreadsheets.', 'Custom pricing', 'code');
  insertService.run('s6', 'IT Support & Maintenance', 'Reliable support and updates to keep your systems running smoothly.', 'Monthly plans', 'database');
  insertService.run('s7', 'Graphic Design & Branding', 'Logos, marketing materials, and complete brand identity.', 'From LKR 15,000', 'palette');
}

// Seed Stats if empty
const statsCount = db.prepare('SELECT COUNT(*) as count FROM stats').get().count;
if (statsCount === 0) {
  const insertStat = db.prepare('INSERT INTO stats (id, number, suffix, label) VALUES (?, ?, ?, ?)');
  insertStat.run('st1', 40, '+', 'Projects delivered');
  insertStat.run('st2', 98, '%', 'Client satisfaction');
  insertStat.run('st3', 24, 'h', 'Avg. response time');
}

// Seed Features if empty
const featuresCount = db.prepare('SELECT COUNT(*) as count FROM features').get().count;
if (featuresCount === 0) {
  const insertFeature = db.prepare('INSERT INTO features (id, text) VALUES (?, ?)');
  insertFeature.run('f1', 'Direct communication — talk to the people actually building your project.');
  insertFeature.run('f2', 'Fixed-scope quotes before any work starts, no surprise costs.');
  insertFeature.run('f3', 'Built with modern, maintainable tech: React, PHP/Laravel, and Node.js.');
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
  const { name, tagline, about, email, location, whatsapp, facebook, instagram, linkedin } = req.body;
  const update = db.prepare('UPDATE company SET name = ?, tagline = ?, about = ?, email = ?, location = ?, whatsapp = ?, facebook = ?, instagram = ?, linkedin = ? WHERE id = 1');
  update.run(name, tagline, about, email, location, whatsapp, facebook || '', instagram || '', linkedin || '');
  const row = db.prepare('SELECT * FROM company WHERE id = 1').get();
  res.json(row ? [row] : []);
});

// Stats API
app.get('/api/stats', (req, res) => {
  const rows = db.prepare('SELECT * FROM stats ORDER BY id').all();
  res.json(rows);
});

app.post('/api/stats', authenticateToken, (req, res) => {
  const { id, number, suffix, label } = req.body;
  const newId = id || `st${Date.now()}`;
  const insert = db.prepare('INSERT INTO stats (id, number, suffix, label) VALUES (?, ?, ?, ?)');
  insert.run(newId, number, suffix, label);
  const row = db.prepare('SELECT * FROM stats WHERE id = ?').get(newId);
  res.json(row);
});

app.put('/api/stats/:id', authenticateToken, (req, res) => {
  const { number, suffix, label } = req.body;
  const update = db.prepare('UPDATE stats SET number = ?, suffix = ?, label = ? WHERE id = ?');
  const info = update.run(number, suffix, label, req.params.id);
  if (info.changes === 0) {
    const insert = db.prepare('INSERT INTO stats (id, number, suffix, label) VALUES (?, ?, ?, ?)');
    insert.run(req.params.id, number, suffix, label);
  }
  const row = db.prepare('SELECT * FROM stats WHERE id = ?').get(req.params.id);
  res.json(row || {});
});

app.delete('/api/stats/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM stats WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

// Features API
app.get('/api/features', (req, res) => {
  const rows = db.prepare('SELECT * FROM features ORDER BY id').all();
  res.json(rows);
});

app.post('/api/features', authenticateToken, (req, res) => {
  const { id, text } = req.body;
  const newId = id || `f${Date.now()}`;
  const insert = db.prepare('INSERT INTO features (id, text) VALUES (?, ?)');
  insert.run(newId, text);
  const row = db.prepare('SELECT * FROM features WHERE id = ?').get(newId);
  res.json(row);
});

app.put('/api/features/:id', authenticateToken, (req, res) => {
  const { text } = req.body;
  const update = db.prepare('UPDATE features SET text = ? WHERE id = ?');
  const info = update.run(text, req.params.id);
  if (info.changes === 0) {
    const insert = db.prepare('INSERT INTO features (id, text) VALUES (?, ?)');
    insert.run(req.params.id, text);
  }
  const row = db.prepare('SELECT * FROM features WHERE id = ?').get(req.params.id);
  res.json(row || {});
});

app.delete('/api/features/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM features WHERE id = ?').run(req.params.id);
  res.status(204).send();
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
