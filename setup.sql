-- ============================================
--  PORTFOLIO DATABASE SETUP
--  Run: mysql -u root -p < setup.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- ===== CONTACTS TABLE =====
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  INDEX idx_email (email),
  INDEX idx_created (created_at)
);

-- ===== PROJECTS TABLE =====
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
);

-- ===== SKILLS TABLE =====
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  proficiency INT DEFAULT 0 CHECK (proficiency BETWEEN 0 AND 100),
  icon VARCHAR(100),
  display_order INT DEFAULT 0
);

-- ===== SEED SKILLS =====
INSERT INTO skills (name, category, proficiency, icon, display_order) VALUES
  ('Java', 'Programming Language', 85, 'fab fa-java', 1),
  ('MySQL', 'Database', 80, 'fas fa-database', 2),
  ('HTML5', 'Markup Language', 90, 'fab fa-html5', 3),
  ('CSS3', 'Styling', 85, 'fab fa-css3-alt', 4),
  ('JavaScript', 'Programming Language', 78, 'fab fa-js', 5),
  ('Node.js / Express', 'Backend Framework', 70, 'fab fa-node-js', 6)
ON DUPLICATE KEY UPDATE name = name;

-- ===== SEED PROJECT =====
INSERT INTO projects (title, subtitle, description, tech_stack, github_url, live_url, is_featured) VALUES
  ('SpendIQ', 'Personal Expense Analyzer',
   'A full-stack web application that helps users track, analyze, and visualize their personal expenses with smart categorization, monthly summaries, trend analysis, and actionable insights.',
   'HTML,CSS,JavaScript,Node.js,Express.js,MySQL',
   'https://github.com/vrentika/spendiq',
   'https://spendiq.vercel.app',
   TRUE)
ON DUPLICATE KEY UPDATE title = title;

SELECT '✅ Database setup complete!' AS status;
