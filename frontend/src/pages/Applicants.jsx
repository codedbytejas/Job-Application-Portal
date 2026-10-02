import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import Footer from '../components/Footer';
import { getApplicantStatuses, setApplicantStatus } from '../utils/recruiterStorage';
import {
  IconArrowLeft,
  IconMapPin,
  IconMail,
  IconCalendar,
  IconFileText,
  IconStar,
  IconSearch,
  IconUsers
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
// Base server URL for resume uploads
const SERVER_URL = API_URL.replace('/api', '');

function Applicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusMap, setStatusMap] = useState({});

  const [toast, setToast] = useState({ message: '', type: 'success' });

  const token = localStorage.getItem('token');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    setStatusMap(getApplicantStatuses());
    const handleStatusChange = () => {
      setStatusMap(getApplicantStatuses());
    };
    window.addEventListener('applicantStatusesChanged', handleStatusChange);
    return () => window.removeEventListener('applicantStatusesChanged', handleStatusChange);
  }, []);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // 1. Fetch job metadata
        const jobRes = await axios.get(`${API_URL}/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setJob(jobRes.data);

        // 2. Fetch applicants
        const appRes = await axios.get(`${API_URL}/jobs/${id}/applicants`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApplicants(appRes.data);
      } catch (err) {
        setError(
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : 'You are not authorized to view these applicants.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [id, token]);

  const handleStatusUpdate = (applicantId, newStatus) => {
    setApplicantStatus(applicantId, newStatus);
    showToast(`Candidate status updated to "${newStatus}"`, 'success');
  };

  // Filter applicants
  const filteredApplicants = applicants.filter((app) => {
    const name = app.candidate?.name?.toLowerCase() || '';
    const email = app.candidate?.email?.toLowerCase() || '';
    const q = searchFilter.toLowerCase();
    const matchesSearch = name.includes(q) || email.includes(q);

    const currentStatus = statusMap[app._id] || 'Submitted';
    const matchesStatus =
      statusFilter === 'all' || currentStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="applicants-page-root">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <span className="section-eyebrow">APPLICANT TRACKING SYSTEM (ATS)</span>
            <h1 className="page-title">Candidate Pipeline</h1>
            {job && (
              <p className="page-subtitle">
                Reviewing applicants for <strong>{job.title}</strong> at <strong>{job.company}</strong> ({job.location})
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/recruiter-dashboard" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <IconArrowLeft size={14} /> Recruiter Dashboard
            </Link>
          </div>
        </div>

        {error ? (
          <div className="dashboard-card">
            <div className="alert alert-error">{error}</div>
            <Link to="/recruiter-dashboard" className="btn btn-secondary">
              Return to Dashboard
            </Link>
          </div>
        ) : loading ? (
          <div className="loading-state-box">
            <div className="spinner"></div>
            <p>Loading candidate applicants...</p>
          </div>
        ) : (
          <div className="dashboard-card">
            {/* Status Tabs Bar */}
            <div className="applicants-filter-tabs">
              <button
                className={`dashboard-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All Candidates ({applicants.length})
              </button>
              <button
                className={`dashboard-tab-btn ${statusFilter === 'Submitted' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Submitted')}
              >
                Submitted
              </button>
              <button
                className={`dashboard-tab-btn ${statusFilter === 'Reviewing' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Reviewing')}
              >
                Reviewing
              </button>
              <button
                className={`dashboard-tab-btn ${statusFilter === 'Shortlisted' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Shortlisted')}
              >
                Shortlisted
              </button>
              <button
                className={`dashboard-tab-btn ${statusFilter === 'Interview' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Interview')}
              >
                Interview
              </button>
              <button
                className={`dashboard-tab-btn ${statusFilter === 'Hired' ? 'active' : ''}`}
                onClick={() => setStatusFilter('Hired')}
              >
                Hired
              </button>
            </div>

            <div className="dashboard-card-header" style={{ marginTop: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 className="dashboard-card-title">
                  Candidate Resumes ({filteredApplicants.length})
                </h2>
              </div>

              <div style={{ minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Search by candidate name or email..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 0.75rem' }}
                />
              </div>
            </div>

            {applicants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: '#f1f5f9', borderRadius: '50%', color: '#64748b', marginBottom: '1rem' }}>
                  <IconUsers size={32} />
                </div>
                <h3>No Candidates Have Applied Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '440px', margin: '0.5rem auto' }}>
                  Candidate applications and PDF resumes submitted for this opening will appear here automatically.
                </p>
              </div>
            ) : filteredApplicants.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                No candidates found matching the selected status or search filter.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Candidate Info</th>
                      <th>Email Contact</th>
                      <th>Application Date</th>
                      <th>Resume PDF</th>
                      <th>Candidate Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplicants.map((app) => {
                      const currentStatus = statusMap[app._id] || 'Submitted';
                      return (
                        <tr key={app._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div
                                className="job-company-avatar"
                                style={{
                                  width: 38,
                                  height: 38,
                                  fontSize: '0.95rem',
                                  background: '#3b82f6',
                                  borderRadius: '50%'
                                }}
                              >
                                {(app.candidate?.name || 'C').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                                  {app.candidate?.name || 'Candidate'}
                                </strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  ID: {app._id.slice(-6)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <a
                              href={`mailto:${app.candidate?.email}`}
                              style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}
                            >
                              {app.candidate?.email || 'N/A'}
                            </a>
                          </td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <IconCalendar size={13} /> {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            {app.resume ? (
                              <a
                                href={`${SERVER_URL}/uploads/${app.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                              >
                                <IconFileText size={14} /> View Resume
                              </a>
                            ) : (
                              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>No file</span>
                            )}
                          </td>
                          <td>
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                              className="status-select-control"
                            >
                              <option value="Submitted">Submitted</option>
                              <option value="Reviewing">Under Review</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview">Interview Scheduled</option>
                              <option value="Hired">Hired</option>
                              <option value="Rejected">Not Selected</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer onShowToast={showToast} />
    </div>
  );
}

export default Applicants;
