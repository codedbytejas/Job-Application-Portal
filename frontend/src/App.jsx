import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AddJob from './pages/AddJob';
import Applicants from './pages/Applicants';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Landing & Public Discovery Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Dashboard Routes */}
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

        {/* Recruiter Dashboard & Job Creation Routes */}
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/add-job" element={<AddJob />} />
        <Route path="/recruiter/jobs/new" element={<AddJob />} />
        <Route path="/jobs/:id/applicants" element={<Applicants />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
