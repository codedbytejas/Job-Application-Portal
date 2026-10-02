import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import ShareModal from '../components/ShareModal';
import CompanyModal from '../components/CompanyModal';
import Footer from '../components/Footer';
import { DEMO_JOBS, TOP_COMPANIES } from '../data/demoJobs';
import { isJobSaved, toggleSaveJob } from '../utils/savedJobs';
import { saveLocalAppliedJob, isJobLocallyApplied } from '../utils/appliedJobs';
import {
  IconBookmark,
  IconShare,
  IconMapPin,
  IconDollar,
  IconBriefcase,
  IconBuilding,
  IconUser,
  IconClock,
  IconUsers,
  IconZap,
  IconCheck,
  IconStar,
  IconChevronRight,
  IconArrowLeft,
  IconFileText,
  IconShield,
  IconAward,
  IconTarget,
  IconCode
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [showApplyBox, setShowApplyBox] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Modals & Toast
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [shareOpen, setShareOpen] = useState(false);
  const [companyModalData, setCompanyModalData] = useState(null);

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchJob = async () => {
      // 1. Check if it's a demo job
      const demoMatch = DEMO_JOBS.find((d) => d._id === id);
      if (demoMatch) {
        setJob(demoMatch);
        setLoading(false);
        setIsSaved(isJobSaved(id));
        return;
      }

      // 2. Fetch from backend API
      try {
        const res = await axios.get(`${API_URL}/jobs/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setJob(res.data);
        setIsSaved(isJobSaved(id));
      } catch (err) {
        // Fallback to demo 1 if not found
        const fallback = DEMO_JOBS[0];
        setJob(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  // Check if candidate already applied by querying candidate applications
  useEffect(() => {
    const checkAppliedStatus = async () => {
      if (role === 'candidate') {
        // Check local storage first
        if (userId && isJobLocallyApplied(userId, id)) {
          setHasApplied(true);
          return;
        }

        // Check backend applications
        if (token) {
          try {
            const res = await axios.get(`${API_URL}/applications/my-applications`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const applied = res.data.some(
              (app) => app.job && (app.job._id === id || app.job === id)
            );
            if (applied) {
              setHasApplied(true);
            }
          } catch (err) {
            // ignore
          }
        }
      }
    };

    checkAppliedStatus();
  }, [id, role, token, userId]);

  const handleBookmark = () => {
    const nextSaved = toggleSaveJob(id);
    setIsSaved(nextSaved);
    showToast(
      nextSaved ? 'Job added to your saved bookmarks!' : 'Job removed from bookmarks',
      nextSaved ? 'saved' : 'info'
    );
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess('');

    if (!resumeFile) {
      setApplyError('Please upload your resume in PDF format.');
      return;
    }

    if (resumeFile.type !== 'application/pdf' && !resumeFile.name.endsWith('.pdf')) {
      setApplyError('Only PDF files are allowed!');
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setApplyError('File size exceeds the 5MB limit. Please upload a smaller PDF.');
      return;
    }

    setApplying(true);

    const applicationRecord = {
      _id: 'app_' + Date.now(),
      job: job,
      jobId: id,
      resume: resumeFile.name,
      appliedAt: new Date().toISOString(),
      status: 'Submitted'
    };

    // If it's a demo job, simulate successful application & save locally
    if (job.isDemo) {
      setTimeout(() => {
        saveLocalAppliedJob(userId, applicationRecord);
        setApplySuccess('Application submitted successfully! Recruiter has been notified.');
        setHasApplied(true);
        setApplying(false);
        setShowApplyBox(false);
        showToast('Application submitted successfully!', 'success');
      }, 600);
      return;
    }

    // Real backend application submission
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const res = await axios.post(`${API_URL}/jobs/${id}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      saveLocalAppliedJob(userId, {
        ...applicationRecord,
        _id: res.data.application?._id || applicationRecord._id
      });

      setApplySuccess(res.data.message || 'Application submitted successfully');
      setHasApplied(true);
      setShowApplyBox(false);
      setResumeFile(null);
      showToast('Application submitted successfully!', 'success');
    } catch (err) {
      // If backend returns duplicate error, mark as applied
      if (err.response?.data?.message?.includes('already applied')) {
        setHasApplied(true);
        saveLocalAppliedJob(userId, applicationRecord);
      }
      setApplyError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to submit application. Please try again.'
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
        <p>Loading role details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Position not found</h2>
        <p>The job posting you are looking for may have expired or been removed.</p>
        <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Browse All Jobs
        </Link>
      </div>
    );
  }

  // Derive enriched company info
  const companyName = job.company || 'Enterprise Company';
  const initial = job.companyInitial || companyName.charAt(0).toUpperCase();
  const avatarBg = job.companyColor || '#1e40af';

  const matchedCompany = TOP_COMPANIES.find(
    (c) => c.name.toLowerCase() === companyName.toLowerCase()
  ) || {
    name: companyName,
    rating: 4.3,
    reviews: '12K+',
    employees: '5,000+ employees',
    industry: 'Technology & Enterprise Solutions',
    tagline: 'Leading innovators providing world-class technology services.',
    benefits: ['Comprehensive Medical Insurance', 'Flexible Hybrid Work', 'Annual Performance Bonus', 'Annual Learning Allowance']
  };

  const salary = job.salary || 'Competitive / Best in Industry';
  const jobType = job.jobType || 'Full Time';
  const experience = job.experience || '1-3 Years';
  const workplace = job.workplaceType || (job.location?.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid');
  const skills = job.skills && Array.isArray(job.skills) ? job.skills : ['JavaScript', 'Node.js', 'React.js', 'Git', 'REST API', 'SQL'];

  const responsibilities = job.responsibilities || [
    'Design, develop, and maintain responsive, scalable, and high-performance web applications.',
    'Collaborate seamlessly with cross-functional product designers, managers, and engineers.',
    'Write clean, maintainable, test-covered code with comprehensive documentation.',
    'Participate actively in architectural reviews, sprint planning, and code quality audits.'
  ];

  const requirements = job.requirements || [
    `Strong problem-solving capability with ${experience} of hands-on technical development experience.`,
    'Proficiency in core frontend and backend programming frameworks.',
    'Experience working with database systems, cloud platforms, and RESTful service integrations.',
    'Excellent collaborative communication skills and attention to engineering detail.'
  ];

  const perks = job.perks || [
    'Comprehensive Healthcare & Dental Coverage',
    'Flexible Hybrid & Remote Work Arrangement',
    'Annual Education & Conference Stipend',
    'Performance-linked Annual Bonus',
    'Generous Paid Time Off & Parental Leave'
  ];

  const similarJobs = DEMO_JOBS.filter((j) => j._id !== id).slice(0, 3);

  return (
    <div className="job-details-page">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {shareOpen && (
        <ShareModal
          job={job}
          onClose={() => setShareOpen(false)}
          onShowToast={showToast}
        />
      )}

      {companyModalData && (
        <CompanyModal
          company={companyModalData}
          onClose={() => setCompanyModalData(null)}
        />
      )}

      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="job-breadcrumb">
          <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconArrowLeft size={14} /> Back to Open Positions
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span>{companyName}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{job.title}</span>
        </div>

        {/* Hero Banner Card */}
        <div className="job-hero-card">
          <div className="job-hero-info">
            <div className="job-company-avatar job-hero-avatar" style={{ backgroundColor: avatarBg }}>
              {initial}
            </div>

            <div className="job-hero-text">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <h1 className="job-hero-title">{job.title}</h1>
                {job.featured && (
                  <span className="badge-featured" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconStar size={12} fill="#d97706" /> Featured
                  </span>
                )}
                {job.urgent && (
                  <span className="badge-urgent">
                    Urgent
                  </span>
                )}
              </div>

              <div className="job-hero-company-line">
                <button
                  type="button"
                  className="company-name-link"
                  onClick={() => setCompanyModalData(matchedCompany)}
                >
                  {companyName}
                </button>
                <span className="company-verified" title="Verified Employer"><IconCheck size={11} /></span>
                <span className="meta-separator">•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconMapPin size={13} /> {job.location}
                </span>
                <span className="meta-separator">•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconClock size={13} /> {job.createdAt ? `Posted ${new Date(job.createdAt).toLocaleDateString()}` : 'Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="job-header-actions">
            <button
              className={`btn ${isSaved ? 'btn-danger-outline' : 'btn-outline'}`}
              onClick={handleBookmark}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconBookmark size={16} fill={isSaved ? 'var(--primary-color)' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setShareOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconShare size={16} /> Share
            </button>

            {hasApplied ? (
              <div className="applied-pill-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <IconCheck size={14} /> Application Submitted
              </div>
            ) : role === 'candidate' ? (
              <button
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => setShowApplyBox(true)}
              >
                <IconZap size={16} /> Apply Now
              </button>
            ) : role === 'recruiter' ? (
              <span className="recruiter-view-badge">Recruiter View</span>
            ) : (
              <button
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem' }}
                onClick={() => navigate('/login')}
              >
                Sign In to Apply
              </button>
            )}
          </div>
        </div>

        {/* Main Split Layout */}
        <div className="job-details-layout">
          {/* Left Column: Comprehensive Job Information */}
          <main className="job-main-card">
            {/* Highlights Grid */}
            <div className="job-highlights-grid">
              <div className="highlight-box">
                <span className="highlight-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconDollar size={20} />
                </span>
                <div>
                  <div className="highlight-label">Offered Salary</div>
                  <div className="highlight-value highlight-salary">{salary}</div>
                </div>
              </div>

              <div className="highlight-box">
                <span className="highlight-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconBuilding size={20} />
                </span>
                <div>
                  <div className="highlight-label">Workplace Mode</div>
                  <div className="highlight-value">{workplace}</div>
                </div>
              </div>

              <div className="highlight-box">
                <span className="highlight-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconBriefcase size={20} />
                </span>
                <div>
                  <div className="highlight-label">Job Type</div>
                  <div className="highlight-value">{jobType}</div>
                </div>
              </div>

              <div className="highlight-box">
                <span className="highlight-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconUser size={20} />
                </span>
                <div>
                  <div className="highlight-label">Experience</div>
                  <div className="highlight-value">{experience}</div>
                </div>
              </div>
            </div>

            {/* Application Feedback Alerts */}
            {applySuccess && (
              <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconCheck size={18} /> {applySuccess}
              </div>
            )}
            {applyError && (
              <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
                {applyError}
              </div>
            )}

            {/* Section 1: Overview */}
            <section className="job-section">
              <h2 className="job-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconFileText size={20} /> Role Overview
              </h2>
              <div className="job-text-content">
                <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>
              </div>
            </section>

            {/* Section 2: Key Responsibilities */}
            <section className="job-section">
              <h2 className="job-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconTarget size={20} /> Key Responsibilities
              </h2>
              <ul className="bullet-list">
                {responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </section>

            {/* Section 3: Qualifications */}
            <section className="job-section">
              <h2 className="job-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconAward size={20} /> Qualifications & Requirements
              </h2>
              <ul className="bullet-list">
                {requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>

            {/* Section 4: Required Skills */}
            <section className="job-section">
              <h2 className="job-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconCode size={20} /> Tech Stack & Skills
              </h2>
              <div className="skills-container">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Section 5: Benefits & Perks */}
            <section className="job-section">
              <h2 className="job-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconStar size={20} /> Perks & Benefits
              </h2>
              <div className="perks-grid">
                {perks.map((perk, index) => (
                  <div key={index} className="perk-card">
                    <span className="perk-check" style={{ display: 'inline-flex', alignItems: 'center' }}><IconCheck size={14} /></span>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Hiring Process */}
            <section className="job-section" style={{ marginBottom: 0 }}>
              <h2 className="job-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconClock size={20} /> Hiring Process Timeline
              </h2>
              <div className="hiring-timeline">
                <div className="timeline-step">
                  <div className="step-circle">1</div>
                  <h4>Resume Screening</h4>
                  <p>Recruiter reviews submitted profile within 48-72 hours.</p>
                </div>
                <div className="timeline-step">
                  <div className="step-circle">2</div>
                  <h4>Technical Assessment</h4>
                  <p>Practical coding round or technical discussion.</p>
                </div>
                <div className="timeline-step">
                  <div className="step-circle">3</div>
                  <h4>Managerial Round</h4>
                  <p>Culture fit, architecture, and expectations alignment.</p>
                </div>
                <div className="timeline-step">
                  <div className="step-circle">4</div>
                  <h4>Offer Letter</h4>
                  <p>Compensation finalization and onboarding kickoff.</p>
                </div>
              </div>
            </section>
          </main>

          {/* Right Column: Application Box, Company Card & Safety */}
          <aside className="job-sidebar-area">
            {/* Interactive Application Card */}
            <div className="job-sidebar-card apply-action-card">
              <h3 className="sidebar-card-title">Apply for this Role</h3>

              {hasApplied ? (
                <div className="applied-box-success">
                  <span className="applied-success-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconCheck size={24} />
                  </span>
                  <h4>Application Submitted!</h4>
                  <p>The hiring recruiter has received your application. Track progress in your dashboard.</p>
                  <Link to="/candidate-dashboard" className="btn btn-outline btn-block" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    View My Dashboard <IconChevronRight size={14} />
                  </Link>
                </div>
              ) : role === 'candidate' ? (
                !showApplyBox ? (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                      Submit your resume to <strong>{companyName}</strong> directly with instant confirmation.
                    </p>
                    <button
                      className="btn btn-primary btn-block"
                      style={{ padding: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                      onClick={() => setShowApplyBox(true)}
                    >
                      <IconZap size={16} /> Start Easy Application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="apply-form-active">
                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Upload Resume (PDF format, max 5MB) *
                      </label>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="form-control file-input-styled"
                        required
                      />
                      {resumeFile && (
                        <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <IconCheck size={14} /> Selected: {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Portfolio / GitHub / LinkedIn URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/yourhandle"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="form-control"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>

                    <div className="form-group">
                      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Quick Note to Recruiter (Optional)
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Briefly state why you are a great match..."
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        className="form-control"
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={applying}
                      style={{ padding: '0.8rem', marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      {applying ? 'Uploading & Submitting...' : 'Submit Application'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={() => setShowApplyBox(false)}
                      style={{ padding: '0.45rem' }}
                    >
                      Cancel
                    </button>
                  </form>
                )
              ) : role === 'recruiter' ? (
                <div className="alert alert-info" style={{ fontSize: '0.85rem' }}>
                  You are signed in as a Recruiter. Candidates can submit resumes directly here.
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    Sign in to your candidate account to submit your resume with 1-click application.
                  </p>
                  <button
                    className="btn btn-primary btn-block"
                    style={{ padding: '0.85rem', marginBottom: '0.75rem' }}
                    onClick={() => navigate('/login')}
                  >
                    Login to Apply
                  </button>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>
                    Don't have an account? <Link to="/register" style={{ fontWeight: 600 }}>Register free</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Company Overview Card */}
            <div className="job-sidebar-card">
              <h3 className="sidebar-card-title">About the Employer</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="job-company-avatar" style={{ width: 44, height: 44, backgroundColor: avatarBg }}>
                  {initial}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{companyName}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{matchedCompany.industry}</span>
                </div>
              </div>

              <div className="sidebar-info-row">
                <span className="sidebar-info-label">Company Rating</span>
                <span className="sidebar-info-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconStar size={13} fill="#d97706" /> {matchedCompany.rating} / 5
                </span>
              </div>
              <div className="sidebar-info-row">
                <span className="sidebar-info-label">Company Size</span>
                <span className="sidebar-info-value">{matchedCompany.employees}</span>
              </div>
              <div className="sidebar-info-row">
                <span className="sidebar-info-label">Location</span>
                <span className="sidebar-info-value">{job.location}</span>
              </div>

              <button
                type="button"
                className="btn btn-outline btn-block"
                style={{ marginTop: '1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                onClick={() => setCompanyModalData(matchedCompany)}
              >
                View Employer Profile <IconChevronRight size={14} />
              </button>
            </div>

            {/* Candidate Safety Notice */}
            <div className="job-sidebar-card safety-card">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', marginBottom: '0.4rem' }}>
                <IconShield size={16} /> Candidate Safety Guarantee
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                JobPortal verifies all postings. Genuine employers will never ask for monetary deposits or processing fees.
              </p>
            </div>

            {/* Similar Jobs Recommendations */}
            <div className="job-sidebar-card">
              <h3 className="sidebar-card-title">Similar Positions</h3>
              <div className="similar-jobs-list">
                {similarJobs.map((simJob) => (
                  <Link
                    key={simJob._id}
                    to={`/jobs/${simJob._id}`}
                    className="similar-job-item"
                  >
                    <div
                      className="job-company-avatar"
                      style={{
                        width: 34,
                        height: 34,
                        fontSize: '0.85rem',
                        backgroundColor: simJob.companyColor || '#1e40af'
                      }}
                    >
                      {simJob.companyInitial || simJob.company.charAt(0)}
                    </div>
                    <div>
                      <h5 className="similar-job-title">{simJob.title}</h5>
                      <span className="similar-job-meta">
                        {simJob.company} • {simJob.salary}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer onShowToast={showToast} />
    </div>
  );
}

export default JobDetails;
