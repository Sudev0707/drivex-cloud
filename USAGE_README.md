# DriveX Lite - README (UI-first)

This project root README summarizes the stack and setup. This file adds quick “what you can run now” notes.

## Status (based on current snapshot)
- **Frontend** runs as a SPA with **mock/in-memory state**.
- **Backend** contains Express + storage configuration files, but controller/model/route wiring appears incomplete in this snapshot.

## What to verify
- Frontend: `frontend/package.json` scripts (e.g., `npm run dev`)
- Backend: `backend/package.json` scripts (e.g., `npm start`)

## Next step (production)
Add/complete:
- Controllers + routes for auth, folders, files, sharing
- Mongoose models + schemas
- Storage adapters integration with actual endpoints

