# DriveX Lite (drivebox-lite)

DriveX Lite is a modern cloud storage and file sharing application inspired by Google Drive. It’s built as a MERN-style project with a React frontend, a Node/Express backend, and object storage (Cloudinary and/or AWS S3) for binary files.

> Note: In the current repository snapshot, the backend’s controllers/models/routes appear incomplete/minimal, and the frontend primarily runs with mock/in-memory state.

---

## Features (UI/Product)
- Drive-like dashboard with folders and files
- File upload UI + recent activity panel
- Folder organization (create/rename/trash/restore)
- Sharing (share toggle; UI flow)
- Previews (UI components support previews)
- Auth-protected routes (dashboard-style experience)

---

## Tech Stack

### Slider / Carousel (high-level)
Use the tabs below to explore the stack layers.

#### Frontend (React)
- **React + TypeScript** (SPA)
- **Vite** for bundling
- **React Router** for routing
- **Tailwind CSS** + **shadcn/ui-style** components (Radix UI)
- **sonner** for toast notifications
- **recharts** for charts

#### Backend (Node/Express)
- **Node.js**
- **Express** + **CORS**
- **dotenv** configuration
- **mongoose** for MongoDB connection
- Auth & validation stack:
  - **jsonwebtoken** (JWT)
  - **bcryptjs** (password hashing)
  - **express-validator**

#### File Storage (Cloud Objects)
- **Cloudinary** via `multer-storage-cloudinary`
- **AWS S3** via `multer-s3` + signed URL helpers
- Optional/legacy upload path: **GridFS** via `multer-gridfs-storage`

---

## Architecture (How it’s wired)
- **Frontend**: `frontend/`
  - `src/App.tsx` + `src/AppProviders.tsx` compose providers:
    - `AuthContext`, `FileContext`, `ThemeContext`
  - `src/routes/AppRoutes.tsx` defines protected routes (e.g. `/dashboard`, `/my-drive`)
  - `src/components/` contains dashboard cards, modals, upload UI, and reusable UI primitives

- **Backend**: `backend/`
  - `backend/index.js` starts Express and enables CORS
  - `backend/config/` contains:
    - `connection.js` (MongoDB/mongoose)
    - `cloudinary.js` (Cloudinary + multer upload setup)
    - `s3.js` (S3 + multer-s3 + helpers)

---

## Repository Structure
- `backend/` — Express server + storage configuration
- `frontend/` — React (TypeScript) + Tailwind UI

---

## Deployment
Both projects include Vercel config files (see `frontend/vercel.json`). The frontend is suitable for Vercel deployment.

For production backend deployment, you’d typically set up environment variables for:
- MongoDB connection
- JWT secret
- Cloudinary credentials and/or AWS S3 credentials

---

## Running Locally
### 1) Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2) Backend (server)
```bash
cd backend
npm install
npm start
```

---

## Environment Variables (expected)
(Adjust according to the storage/auth approach you enable.)

### Cloudinary
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### AWS S3
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`

### MongoDB / Auth
- MongoDB Atlas connection string (used by mongoose)
- JWT secret (used by JWT utilities)

---

## UI Tech Stack Slider (image)
If you want a rendered “stack slider with image”, you can drop a screenshot/banner into the repo and reference it here.

**Suggested image placement:**
- `frontend/public/stack-slider.png` (or add to `public/`)

Example:
```md
![DriveX Lite stack slider](frontend/public/stack-slider.png)
```

---

## License
MIT (or update to your actual license if different). 

