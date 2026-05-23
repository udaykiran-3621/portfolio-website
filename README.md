# Vrentika Uday Kiran — Portfolio Website

A modern, full-stack personal portfolio built with **HTML, CSS, JavaScript, Node.js, Express.js, and MySQL**.

---

## 📁 Folder Structure

```
portfolio/
├── public/
│   ├── index.html          ← Main portfolio page
│   ├── css/
│   │   └── style.css       ← All styles (dark luxury theme)
│   └── js/
│       └── main.js         ← Interactivity (cursor, scroll, form, animations)
├── server.js               ← Express server + API routes
├── setup.sql               ← MySQL database schema + seed data
├── package.json            ← Node.js dependencies
├── .env.example            ← Environment variable template
└── README.md               ← This file
```

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 3. Setup MySQL Database
```bash
mysql -u root -p < setup.sql
```
Or from MySQL shell:
```sql
source setup.sql;
```

### 4. Start the Server
```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

### 5. Open in Browser
```
http://localhost:3000
```

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Serve portfolio page |
| GET | `/api/skills` | Fetch all skills |
| GET | `/api/projects` | Fetch all projects |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contacts` | View all messages (admin) |
| PATCH | `/api/contacts/:id/read` | Mark message as read |
| GET | `/api/health` | Server health check |

---

## 🚀 Deployment

### Deploy to Vercel (Frontend Only)
```bash
npm install -g vercel
vercel
```

### Deploy to Heroku (Full-Stack)
```bash
heroku create vrentika-portfolio
heroku addons:create jawsdb:kitefin   # MySQL addon
git push heroku main
```

### Deploy to Railway
1. Push code to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Add MySQL plugin
4. Set environment variables

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL (via mysql2) |
| Fonts | Syne, Cormorant Garamond, DM Mono |
| Icons | Font Awesome 6 |

---

## ✨ Features

- **Custom cursor** with smooth follower animation
- **Scroll reveal** animations for all sections
- **Animated skill bars** triggered on scroll
- **Responsive design** — mobile, tablet, desktop
- **Contact form** with MySQL persistence
- **REST API** for dynamic data loading
- **Noise texture overlay** for premium feel
- **Dark luxury theme** with gold accent palette

---

*Built with ❤️ by Vrentika Uday Kiran*
