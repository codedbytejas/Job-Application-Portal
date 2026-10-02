import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import Footer from '../components/Footer';
import {
  IconArrowLeft,
  IconZap,
  IconPlus,
  IconMapPin,
  IconDollar,
  IconBriefcase,
  IconClock,
  IconCheck
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PRESET_TEMPLATES = [
  {
    label: 'Full Stack MERN Developer',
    title: 'Senior Full Stack Developer (MERN)',
    company: 'TechCorp Solutions',
    location: 'Mumbai, Maharashtra (Hybrid)',
    description: `About the Role:\nWe are seeking a talented Full Stack Developer proficient in MongoDB, Express.js, React.js, and Node.js to design and deliver high-throughput web applications.\n\nKey Responsibilities:\n• Architect scalable microservices and RESTful API endpoints.\n• Build reactive, accessible web user interfaces using React.\n• Collaborate with cross-functional product squads in agile sprints.\n• Optimize database schemas and queries for performance.`
  },
  {
    label: 'Frontend React Specialist',
    title: 'Frontend React Developer',
    company: 'NextGen Digital',
    location: 'Bengaluru, Karnataka (Remote)',
    description: `About the Role:\nJoin our core frontend team to build responsive, intuitive, and delightful customer-facing experiences.\n\nKey Responsibilities:\n• Implement modern React components with state management.\n• Translate Figma design systems into pixel-perfect responsive layouts.\n• Integrate backend REST APIs and handle error boundaries gracefully.\n• Ensure high performance across mobile and desktop browsers.`
  },
  {
    label: 'Backend & Cloud Engineer',
    title: 'Backend Engineer (Node.js & MongoDB)',
    company: 'CloudScale Innovations',
    location: 'Pune, Maharashtra',
    description: `About the Role:\nWe are looking for a Backend Engineer to build robust server architecture, data pipelines, and third-party integrations.\n\nKey Responsibilities:\n• Develop secure API endpoints with JWT authentication and RBAC.\n• Optimize MongoDB query latencies and server memory consumption.\n• Maintain CI/CD pipelines and Docker container deployments.\n• Write automated unit and integration tests.`
  }
];

function AddJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const token = localStorage.getItem('token');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      title: preset.title,
      company: preset.company,
      location: preset.location,
      description: preset.description
    });
    showToast(`Template applied: ${preset.label}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/jobs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      showToast('Job opening published successfully!', 'success');
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 1000);
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to create job posting. Please ensure all required fields are filled.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="add-job-page-root">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Link to="/recruiter-dashboard" style={{ color: 'var(--text-light)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconArrowLeft size={14} /> Back to Recruiter Hub
          </Link>
        </div>

        {/* Preset Templates Bar */}
        <div className="preset-templates-card" style={{ marginBottom: '1.75rem', background: '#ffffff', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <IconZap size={16} /> Quick Fill Templates
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Populate standard job specifications with one click
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESET_TEMPLATES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={() => handleApplyPreset(p)}
              >
                + {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="add-job-split-grid">
          {/* Form Column */}
          <div className="dashboard-card" style={{ padding: '2.25rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <span className="section-eyebrow">NEW LISTING</span>
              <h1 className="page-title" style={{ fontSize: '1.65rem' }}>
                Post a Job Opening
              </h1>
              <p className="page-subtitle">
                Publish your role to thousands of active candidates across India and remote teams.
              </p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Role / Position Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Senior Backend Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label>Company / Organization Name *</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    placeholder="e.g. Tata Consultancy Services"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Workplace Location *</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g. Mumbai, Maharashtra (Hybrid)"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Job Description & Responsibilities *</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="7"
                  placeholder="Detail the daily responsibilities, qualifications, tech stack, and company benefits..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  disabled={loading}
                >
                  <IconPlus size={16} /> {loading ? 'Publishing Job Listing...' : 'Publish Job Opening'}
                </button>
                <Link
                  to="/recruiter-dashboard"
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem 1.5rem' }}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>

          {/* Right Live Preview Column */}
          <aside className="job-preview-column">
            <div className="preview-sticky-wrapper">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Live Card Preview
              </h3>

              <div className="job-card preview-card">
                <div className="job-card-header">
                  <div className="job-company-avatar" style={{ backgroundColor: '#2563eb' }}>
                    {(formData.company || 'C').charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div className="job-card-title-area">
                    <h3 className="job-title">{formData.title || 'Job Title Placeholder'}</h3>
                    <p className="job-company-name">
                      {formData.company || 'Company Name'} <span className="company-verified"><IconCheck size={11} /></span>
                    </p>
                  </div>
                  <span className="badge-featured">Live</span>
                </div>

                <div className="job-meta-grid">
                  <span className="job-meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconMapPin size={13} /> {formData.location || 'Location'}
                  </span>
                  <span className="job-meta-item job-meta-salary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconDollar size={13} /> Competitive
                  </span>
                  <span className="job-meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconBriefcase size={13} /> Full Time
                  </span>
                </div>

                <p className="job-description-snippet">
                  {formData.description || 'Provide a compelling description of the role to attract qualified candidates.'}
                </p>

                <div className="job-card-footer">
                  <span className="job-posted-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconClock size={12} /> Today
                  </span>
                  <span className="btn btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}>
                    View Details
                  </span>
                </div>
              </div>

              <div className="recruiter-tips-card" style={{ marginTop: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                  Recruiter Best Practices
                </strong>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: 1.5 }}>
                  <li>Clearly state tech stack versions (e.g. React 18, Node.js).</li>
                  <li>Specify workplace policy (Remote, Hybrid, or On-site).</li>
                  <li>Mention standard review turnaround time.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer onShowToast={showToast} />
    </div>
  );
}

export default AddJob;
