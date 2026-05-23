const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ===== DATABASE CONNECTION POOL =====
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ===== DATABASE INIT =====
async function initDatabase() {
  try {
    const conn = await pool.getConnection();

    // Create contacts table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE
      )
    `);

    // Create projects table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        tech_stack VARCHAR(500),
        github_url VARCHAR(500),
        live_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create skills table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        proficiency INT DEFAULT 0,
        icon VARCHAR(100),
        display_order INT DEFAULT 0
      )
    `);

    // Seed default skills if empty
    const [skillRows] = await conn.execute('SELECT COUNT(*) as count FROM skills');
    if (skillRows[0].count === 0) {
      await conn.execute(`
        INSERT INTO skills (name, category, proficiency, icon, display_order) VALUES
        ('Java', 'Programming Language', 85, 'fab fa-java', 1),
        ('MySQL', 'Database', 80, 'fas fa-database', 2),
        ('HTML5', 'Markup Language', 90, 'fab fa-html5', 3),
        ('CSS3', 'Styling', 85, 'fab fa-css3-alt', 4),
        ('JavaScript', 'Programming Language', 78, 'fab fa-js', 5),
        ('Node.js / Express', 'Backend Framework', 70, 'fab fa-node-js', 6)
      `);
      console.log('✅ Default skills seeded');
    }

    // Seed default project if empty
    const [projRows] = await conn.execute('SELECT COUNT(*) as count FROM projects');
    if (projRows[0].count === 0) {
      await conn.execute(`
        INSERT INTO projects (title, subtitle, description, tech_stack, github_url, live_url, is_featured) VALUES
        ('SpendIQ', 'Personal Expense Analyzer',
         'A full-stack web application that helps users track, analyze, and visualize their personal expenses.',
         'HTML,CSS,JavaScript,Node.js,Express.js,MySQL',
         'https://github.com/vrentika/spendiq',
         'https://spendiq.vercel.app',
         TRUE)
      `);
      console.log('✅ Default project seeded');
    }

    conn.release();
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    console.log('ℹ️  Running without database — contact form will still work (data not persisted)');
  }
}

// ===== ROUTES =====

// Serve main portfolio page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all skills
app.get('/api/skills', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM skills ORDER BY display_order ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch skills' });
  }
});

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM projects ORDER BY is_featured DESC, created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

// POST contact message
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim(), subject.trim(), message.trim()]
    );

    console.log(`📧 New contact from ${name} <${email}> — Subject: ${subject}`);

    res.json({
      success: true,
      message: 'Message received! I\'ll get back to you soon.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Contact insert error:', err.message);
    // Graceful fallback — still return success to user
    console.log(`📧 [NO-DB] Contact from ${name} <${email}>: ${message}`);
    res.json({ success: true, message: 'Message received! I\'ll get back to you soon.' });
  }
});

// GET contacts (admin endpoint — protect in production)
app.get('/api/contacts', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
});

// Mark contact as read
app.patch('/api/contacts/:id/read', async (req, res) => {
  try {
    await pool.execute('UPDATE contacts SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update contact' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all → SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== START SERVER =====
app.listen(PORT, async () => {
  console.log('');
  console.log('🚀 Portfolio server running at:');
  console.log(`   http://localhost:${PORT}`);
  console.log('');
  await initDatabase();
});

module.exports = app;
