# TASKFLOW &bull; Creative Writer's Hub & Personal Task Manager
> **Week 3 Full Stack MERN Development Internship Submission**  
> Faithfully crafted from the uploaded editorial literary planner blueprint.

---

## 🏛️ Application Overview & Blueprint Fidelity

**TASKFLOW** transforms the editorial, Notion-inspired literary planner blueprint into a production-grade MERN productivity application. Every element from the blueprint has been meticulously preserved and mapped directly to functional task and project management capabilities:

1. **Window Frame & Top Bar:** macOS-style traffic light dots (`🔴 🟡 🟢`), Notion workspace glyph (`[N]`), and live session/user status indicator.
2. **Left Navigation Sidebar:**
   - Top text menu items (*Dashboard, Manuscripts, Character Bible, World Building, Plotting, Writing Prompts, Research Notes, Submission Tracker*).
   - Feather quill emblem with ink flourish.
   - Distinct rounded pastel & dark slate action cards (*Manuscripts* ivory, *World Building* white, *Plotting* dark slate, *Writing Prompts* stone, *Research Notes* caramel tan, *Submission Tracker* ivory).
3. **Hero Banner:** Panoramic photograph of a vintage author desk with antique typewriter and window light, paired with a floating feather quill badge and centered editorial serif typography (`CREATIVE WRITER'S HUB` & `DIGITAL JOURNAL & PLANNER`).
4. **Current Projects Module:** 2×2 shelf displaying real project cover thumbnails (uploaded via Multer), categories, dynamically calculated progress bars, and ink splatter detail.
5. **Writing Goals Dashboard:** Dual circular radial SVG meters displaying live daily and weekly productivity metrics directly from MongoDB.
6. **Quote Accent Card:** Warm ivory parchment card featuring a classic gold-nib fountain pen on cursive script.
7. **My Manuscripts Task Gallery:** Full-width cool slate-blue panel (`#CCD5DD`) housing horizontal task cards with status pills (*Outline*, *In Progress*, *Editing*, *Completed*).
8. **Idea Board & Habit Tracker:**
   - **Idea Board:** Sticky note cards and photo ideas with Multer image upload support.
   - **Habit Tracker:** Interactive checklist with instant state toggling.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS, Lucide React icons, Axios, Context API, Canvas Confetti.
- **Backend:** Node.js, Express.js (MVC Architecture), MongoDB Atlas / Mongoose.
- **Authentication:** JWT (JSON Web Tokens), bcryptjs password hashing, express-validator.
- **File & Image Upload:** Multer (with disk storage, MIME format verification, 5MB limit).
- **Deployment Ready:** Configured for **Render** (backend) and **Vercel** (frontend).

---

## 🚀 Getting Started

### 1. Environment Configuration

Create a `.env` file in `server/` (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 2. Running Locally

To start the backend server:
```bash
cd server
npm start
# Runs Express on http://localhost:5000
```

To start the Vite React frontend:
```bash
cd client
npm run dev
# Runs frontend on http://localhost:5173
```

To run both concurrently from root:
```bash
npm start
```

### 3. Automated Test Suite

Run the complete backend integration test suite (covering authentication, project CRUD, task CRUD, status recalculation, notes, and dashboard metrics):
```bash
npm test
```

Run Multer image upload test:
```bash
node server/test-upload.js
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user (with bcrypt hash and validation).
- `POST /login`: Authenticate user and receive JWT.
- `GET /profile`: Retrieve current authenticated profile (Protected).

### Projects (`/api/projects`)
- `GET /`: Get all projects with auto-calculated progress percentage (Protected).
- `POST /`: Create project (supports multipart image upload via Multer) (Protected).
- `PUT /:id`: Update project details or cover image (Protected).
- `DELETE /:id`: Delete project and safely unassign linked tasks (Protected).

### Tasks (`/api/tasks`)
- `GET /`: Retrieve user tasks with filtering by priority, status, category, project, or keyword search (Protected).
- `POST /`: Create task with due date, priority, project, and Multer image (Protected).
- `PUT /:id`: Update task or cycle status (triggers project progress update) (Protected).
- `DELETE /:id`: Remove task (Protected).

### Idea Notes (`/api/notes`)
- `GET /`: Get idea board notes (Protected).
- `POST /`: Create idea note with optional image upload (Protected).
- `DELETE /:id`: Delete note (Protected).

### Dashboard Metrics (`/api/dashboard`)
- `GET /stats`: Retrieve aggregated statistics (daily completion, weekly progress, overdue count, active projects) (Protected).

---

## ☁️ Deployment Guide

### Backend on Render
1. Push the repository to GitHub.
2. In the Render Dashboard, create a **Web Service** pointing to the repository.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `node server.js`.
6. Add Environment Variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`.

### Frontend on Vercel
1. In the Vercel Dashboard, import the repository.
2. Set **Root Directory** to `client` (or use root with `vercel.json`).
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add Environment Variable: `VITE_API_URL` pointing to your deployed Render backend (e.g., `https://taskflow-server.onrender.com/api`).
