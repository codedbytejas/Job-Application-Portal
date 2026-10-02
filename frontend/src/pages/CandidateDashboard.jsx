import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import Toast from '../components/Toast';
import ShareModal from '../components/ShareModal';
import Footer from '../components/Footer';
import { DEMO_JOBS } from '../data/demoJobs';
import { getSavedJobs } from '../utils/savedJobs';
import { getCandidateProfile, saveCandidateProfile, getApplicantStatuses } from '../utils/recruiterStorage';
import { getLocalAppliedJobs } from '../utils/appliedJobs';
import {
  IconFileText,
  IconBookmark,
  IconZap,
  IconTarget,
  IconSearch,
  IconMapPin,
  IconBuilding,
  IconCalendar,
  IconChevronRight,
  IconCheck,
  IconUser,
  IconBriefcase
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function CandidateDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'applications';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [applications, setApplications] = useState([]);
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appSearch, setAppSearch] = useState('');

  // Profile Form State
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'Candidate';
  const token = localStorage.getItem('token');

  const [profile, setProfile] = useState({
    headline: 'Full Stack JavaScript Developer | React & Node.js',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    experienceYears: '1.5 Years',
    github: 'https://github.com/developer',
    linkedin: 'https://linkedin.com/in/developer',
    skills: ['JavaScript', 'React.js', 'Node.js', 'Express', 'MongoDB', 'Git']
  });
  const [newSkill, setNewSkill] = useState('');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Toast & Share
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [shareJob, setShareJob] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab'));
    }
  }, [searchParams]);

  // Load candidate profile from storage if exists
  useEffect(() => {
    const saved = getCandidateProfile(userId);
    if (saved) {
      setProfile(saved);
    }
  }, [userId]);

  // Fetch applications & saved jobs
  useEffect(() => {
    const fetchApplicationsAndSaved = async () => {
      let backendApps = [];
      let allAvailableJobs = [...DEMO_JOBS];

      try {
        // Fetch all jobs to resolve job references
        const jobsRes = await axios.get(`${API_URL}/jobs`);
        if (jobsRes.data && Array.isArray(jobsRes.data)) {
          allAvailableJobs = [...jobsRes.data, ...DEMO_JOBS];
        }
      } catch (e) {
        // use DEMO_JOBS fallback
      }

      try {
        if (token) {
          const res = await axios.get(`${API_URL}/applications/my-applications`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          backendApps = res.data || [];
        }
      } catch (err) {
        console.warn('Could not fetch backend applications:', err.message);
      } finally {
        setLoading(false);
      }

      // Load local applied jobs
      const localApps = getLocalAppliedJobs(userId);

      // Merge and deduplicate by jobId
      const mergedMap = new Map();

      // Helper to extract clean jobId
      const getJobId = (app) => {
        if (app.job && typeof app.job === 'object' && app.job._id) return app.job._id.toString();
        if (typeof app.job === 'string') return app.job;
        if (app.jobId) return app.jobId.toString();
        return app._id ? app._id.toString() : Math.random().toString();
      };

      // Helper to enrich job details
      const enrichApplication = (app) => {
        let jobObj = app.job;
        if (!jobObj || typeof jobObj === 'string') {
          const jId = typeof jobObj === 'string' ? jobObj : app.jobId;
          jobObj = allAvailableJobs.find((j) => j._id === jId) || {
            _id: jId,
            title: 'Software Position',
            company: 'Partner Enterprise',
            location: 'Remote / Hybrid'
          };
        }
        return {
          ...app,
          job: jobObj,
          appliedAt: app.appliedAt || new Date().toISOString()
        };
      };

      backendApps.forEach((app) => {
        const enriched = enrichApplication(app);
        const jId = getJobId(enriched);
        mergedMap.set(jId, enriched);
      });

      localApps.forEach((app) => {
        const enriched = enrichApplication(app);
        const jId = getJobId(enriched);
        if (!mergedMap.has(jId)) {
          mergedMap.set(jId, enriched);
        }
      });

      const finalApps = Array.from(mergedMap.values());
      setApplications(finalApps);

      // Load saved jobs
      const savedIds = getSavedJobs();
      const matched = allAvailableJobs.filter((j) => savedIds.includes(j._id));
      // Deduplicate matched saved jobs
      const uniqueSaved = Array.from(new Map(matched.map((j) => [j._id, j])).values());
      setSavedJobsList(uniqueSaved);
    };

    fetchApplicationsAndSaved();

    const handleSavedChange = () => {
      const savedIds = getSavedJobs();
      const matched = DEMO_JOBS.filter((j) => savedIds.includes(j._id));
      setSavedJobsList(matched);
    };

    const handleAppliedChange = () => {
      fetchApplicationsAndSaved();
    };

    window.addEventListener('savedJobsChanged', handleSavedChange);
    window.addEventListener('appliedJobsChanged', handleAppliedChange);

    return () => {
      window.removeEventListener('savedJobsChanged', handleSavedChange);
      window.removeEventListener('appliedJobsChanged', handleAppliedChange);
    };
  }, [token, userId]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    saveCandidateProfile(userId, profile);
    setProfileSavedMsg('Profile details updated successfully!');
    showToast('Profile updated successfully!', 'success');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove)
    });
  };

  // Filter applications by search
  const filteredApplications = applications.filter((app) => {
    const title = app.job?.title?.toLowerCase() || '';
    const comp = app.job?.company?.toLowerCase() || '';
    const q = appSearch.toLowerCase();
    return title.includes(q) || comp.includes(q);
  });

  const applicantStatuses = getApplicantStatuses();

  return (
    <div className="candidate-dashboard-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {shareJob && (
        <ShareModal
          job={shareJob}
          onClose={() => setShareJob(null)}
          onShowToast={showToast}
        />
      )}

      <div className="container">
        {/* Dashboard Top Header */}
        <div className="page-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <span className="section-eyebrow">CANDIDATE WORKSPACE</span>
            <h1 className="page-title">Welcome back, {userName}</h1>
            <p className="page-subtitle">
              Manage your job submissions, track recruiter status, and discover personalized openings.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/jobs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <IconSearch size={16} /> Explore Open Roles
            </Link>
          </div>
        </div>

        {/* Top Metric Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconFileText size={20} />
            </div>
            <div className="stat-info">
              <h4>Applied Positions</h4>
              <div className="stat-number">{applications.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBookmark size={20} />
            </div>
            <div className="stat-info">
              <h4>Saved Bookmarks</h4>
              <div className="stat-number">{savedJobsList.length}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconZap size={20} />
            </div>
            <div className="stat-info">
              <h4>Active In Review</h4>
              <div className="stat-number">
                {applications.filter((a) => (applicantStatuses[a._id] || 'Submitted') !== 'Rejected').length}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconTarget size={20} />
            </div>
            <div className="stat-info">
              <h4>Profile Strength</h4>
              <div className="stat-number" style={{ color: '#16a34a' }}>92%</div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs-bar">
          <button
            className={`dashboard-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('applications');
              setSearchParams({ tab: 'applications' });
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <IconFileText size={16} /> My Applications ({applications.length})
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('saved');
              setSearchParams({ tab: 'saved' });
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <IconBookmark size={16} /> Saved Jobs ({savedJobsList.length})
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('profile');
              setSearchParams({ tab: 'profile' });
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <IconUser size={16} /> Candidate Profile & Skills
          </button>
        </div>

        {/* TAB 1: Submitted Applications */}
        {activeTab === 'applications' && (
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">Submitted Applications</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Real-time status tracking for all roles you have applied for.
                </p>
              </div>

              {applications.length > 0 && (
                <div style={{ maxWidth: '260px' }}>
                  <input
                    type="text"
                    placeholder="Search applied roles..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
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
                <p>Loading submitted applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: '#f1f5f9', borderRadius: '50%', color: '#64748b', marginBottom: '1rem' }}>
                  <IconFileText size={32} />
                </div>
                <h3>No Applications Submitted Yet</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0.5rem auto 1.5rem auto' }}>
                  Browse open positions and submit your resume to start tracking your interviews and recruiter responses here.
                </p>
                <Link to="/jobs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  Browse Available Positions <IconChevronRight size={14} />
                </Link>
              </div>
            ) : filteredApplications.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No applications matching "{appSearch}"
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Position & Employer</th>
                      <th>Workplace</th>
                      <th>Applied On</th>
                      <th>Application Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => {
                      const status = applicantStatuses[app._id] || app.status || 'Submitted';
                      const job = app.job || {};
                      const company = job.company || 'Enterprise Company';
                      const initial = job.companyInitial || company.charAt(0).toUpperCase();
                      const avatarBg = job.companyColor || '#1e40af';

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
                                  background: avatarBg
                                }}
                              >
                                {initial}
                              </div>
                              <div>
                                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>
                                  {job.title || 'Job Opening'}
                                </strong>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                                  <IconBuilding size={12} /> {company}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <IconMapPin size={13} /> {job.location || 'Remote / Hybrid'}
                            </span>
                          </td>
                          <td>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <IconCalendar size={13} /> {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge-pill status-${status.toLowerCase()}`}>
                              ● {status}
                            </span>
                          </td>
                          <td>
                            {job._id && (
                              <Link
                                to={`/jobs/${job._id}`}
                                className="btn btn-outline"
                                style={{ padding: '0.35rem 0.8rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              >
                                View Role <IconChevronRight size={13} />
                              </Link>
                            )}
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

        {/* TAB 2: Saved Jobs Bookmarks */}
        {activeTab === 'saved' && (
          <div>
            <div className="dashboard-card-header" style={{ marginBottom: '1.25rem' }}>
              <div>
                <h2 className="dashboard-card-title">Bookmarked Opportunities</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Roles you have saved to review or apply for later.
                </p>
              </div>
            </div>

            {savedJobsList.length === 0 ? (
              <div className="dashboard-card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', background: '#f1f5f9', borderRadius: '50%', color: '#64748b', marginBottom: '1rem' }}>
                  <IconBookmark size={32} />
                </div>
                <h3>No Saved Jobs</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0.5rem auto 1.5rem auto' }}>
                  Click the bookmark icon on any job card to save roles you are interested in applying for.
                </p>
                <Link to="/jobs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  Explore Jobs & Bookmark <IconChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="job-grid">
                {savedJobsList.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onShare={(j) => setShareJob(j)}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Candidate Profile & Skills */}
        {activeTab === 'profile' && (
          <div className="dashboard-card" style={{ maxWidth: '850px', margin: '0 auto' }}>
            <div className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">Candidate Profile & Skills</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Keep your technical skillset and links up to date to increase recruiter visibility.
                </p>
              </div>
            </div>

            {profileSavedMsg && (
              <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IconCheck size={16} /> {profileSavedMsg}
              </div>
            )}

            <form onSubmit={handleProfileSave}>
              <div className="form-group">
                <label>Professional Headline</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer | React, TypeScript & Next.js"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label>Current Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Mumbai, India"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="form-control"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              {/* Skills Tag Management */}
              <div className="form-group">
                <label>Technical Skills & Keywords</label>
                <div className="skills-container" style={{ marginBottom: '0.75rem' }}>
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag editable-skill-tag">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="skill-remove-btn"
                        aria-label="Remove skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Add a new skill (e.g. Docker, TypeScript)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.9rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn btn-secondary"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '1.25rem', padding: '0.75rem 2rem' }}
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}

        {/* Recommended Jobs Section */}
        <div style={{ marginTop: '3.5rem' }}>
          <div className="page-header" style={{ marginBottom: '1.25rem' }}>
            <div>
              <span className="section-eyebrow">MATCHED OPPORTUNITIES</span>
              <h2 className="section-title" style={{ fontSize: '1.35rem', marginBottom: 0 }}>
                Recommended For You
              </h2>
            </div>
            <Link to="/jobs" className="btn btn-outline" style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              View All Jobs <IconChevronRight size={14} />
            </Link>
          </div>

          <div className="job-grid">
            {DEMO_JOBS.slice(0, 3).map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onShare={(j) => setShareJob(j)}
                onShowToast={showToast}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer onShowToast={showToast} />
    </div>
  );
}

export default CandidateDashboard;
