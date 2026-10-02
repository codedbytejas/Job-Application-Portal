# Backend - Job Application Portal

Simple, clean Node.js & Express backend for the Job Application Portal college project.

## Scripts
```bash
npm install
npm run dev   # Runs server with nodemon
npm start     # Runs server with node
```

## Structure
- `config/db.js` - MongoDB connection
- `controllers/` - Auth, Job, and Application route handlers
- `middleware/` - JWT auth and Multer PDF upload handlers
- `models/` - Candidate, Recruiter, Job, Application schemas
- `routes/` - Express routers
- `uploads/` - Saved resume PDFs
- `postman_collection.json` - Postman API collection
