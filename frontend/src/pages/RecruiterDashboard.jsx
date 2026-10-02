import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import Footer from '../components/Footer';
import {
  IconBriefcase,
  IconUsers,
  IconZap,
  IconShield,
  IconSearch,
  IconMapPin,
  IconCalendar,
  IconPlus,
  IconShare,
  IconChevronRight
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [toast, setToast] = useState({ message: '', type: 'success' });

  const userName = localStorage.getItem('userName') || 'Recruiter';
  const token = localStorage.getItem('token');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await axios.get(`${API_URL}/jobs/recruiter/my-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setJobs(res.data);
      } catch (err) {
        setError('Failed to fetch your posted jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [token]);

  const handleCopyLink = (jobId) => {
    const url = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(url);
    showToast('Job listing URL copied to clipboard!', 'success');
  };

  const filteredJobs = jobs.filter((j) => {
    const q = searchTerm.toLowerCase();
    return (
      (j.title && j.title.toLowerCase().includes(q)) ||
      (j.company && j.company.toLowerCase().includes(q)) ||
      (j.location && j.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="recruiter-dashboard-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="container">
        {/* Recruiter Header */}
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <span className="section-eyebrow">TALENT ACQUISITION SUITE</span>
            <h1 className="page-title">Recruiter Hub</h1>
            <p className="page-subtitle">
              Welcome back, {userName}. Oversee your talent pipeline, review candidate resumes, and create new openings.
            </p>
          </div>
          <Link to="/add-job" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <IconPlus size={16} /> Create New Job Opening
          </Link>
        </div>

        {/* Top Metric Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBriefcase size={20} />
            </div>
            <div className="stat-info">
              <h4>Active Postings</h4>
              <div className="stat-number">{jobs.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconUsers size={20} />
            </div>
            <div className="stat-info">
              <h4>Hiring Pipeline</h4>
              <div className="stat-number" style={{ fontSize: '1.35rem', color: '#7c3aed' }}>
                Active Hiring
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconZap size={20} />
            </div>
            <div className="stat-info">
              <h4>Direct Applicants</h4>
              <div className="stat-number" style={{ color: '#16a34a' }}>Instant Access</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconShield size={20} />
            </div>
            <div className="stat-info">
              <h4>Employer Status</h4>
              <div className="stat-number" style={{ fontSize: '1.25rem', color: '#d97706' }}>Verified</div>
            </div>
          </div>
        </div>

        {/* Posted Jobs Table Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="dashboard-card-title">Managed Job Openings</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {jobs.length} total listings published on JobPortal
              </p>
            </div>

            {jobs.length > 0 && (
              <div style={{ minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Filter your postings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                />
              </div>
            )}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loading-state-box">
              <div className="spinner"></div>
              <p>Fetching recruiter postings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: '#f1f5f9', borderRadius: '50%', color: '#64748b', marginBottom: '1rem' }}>
                <IconBriefcase size={32} />
              </div>
              <h3>No Job Openings Published Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '460px', margin: '0.5rem auto 1.5rem auto' }}>
                Publish your first position specification to begin receiving qualified candidate resumes and technical profiles.
              </p>
              <Link to="/add-job" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <IconPlus size={16} /> Publish Your First Job Opening
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title & Organization</th>
                    <th>Location</th>
                    <th>Date Published</th>
                    <th>Status</th>
                    <th>Recruiter Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            className="job-company-avatar"
                            style={{
                              width: 38,
                              height: 38,
                              fontSize: '0.95rem',
                              background: '#2563eb'
                            }}
                          >
                            {(job.company || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                              {job.title}
                            </strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                              {job.company}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <IconMapPin size={13} /> {job.location}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <IconCalendar size={13} /> {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge-pill status-hired">
                          ● Active
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <Link
                            to={`/jobs/${job._id}/applicants`}
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <IconUsers size={14} /> View Candidates
                          </Link>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          >
                            Live Page
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => handleCopyLink(job._id)}
                            style={{ padding: '0.4rem 0.65rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Copy Direct Link"
                          >
                            <IconShare size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer onShowToast={showToast} />
    </div>
  );
}

export default RecruiterDashboard;
