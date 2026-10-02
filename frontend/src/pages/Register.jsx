import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import { IconBriefcase, IconCheck, IconUser, IconBuilding } from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const endpoint =
        role === 'candidate'
          ? `${API_URL}/auth/candidate/register`
          : `${API_URL}/auth/recruiter/register`;

      await axios.post(endpoint, { name, email, password });

      setSuccess('Account created successfully! Redirecting to login...');
      showToast('Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Registration failed. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="auth-split-card">
        {/* Left Side: Recruitment Branding */}
        <div className="auth-branding-side">
          <div className="auth-brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-flex', padding: '0.4rem', background: '#2563eb', borderRadius: '8px', color: '#fff' }}>
              <IconBriefcase size={22} />
            </span>
            <span>JobPortal</span>
          </div>

          <div className="auth-branding-quote">
            <h2>Join thousands of successful candidates & recruiters.</h2>
            <p>
              Whether you are looking for your dream job or searching for exceptional engineering talent, JobPortal makes hiring seamless, fast, and transparent.
            </p>
          </div>

          <div className="auth-perks-list">
            <div className="auth-perk-item">
              <span><IconCheck size={14} /></span> Zero registration fees
            </div>
            <div className="auth-perk-item">
              <span><IconCheck size={14} /></span> Direct hiring manager inbox
            </div>
            <div className="auth-perk-item">
              <span><IconCheck size={14} /></span> Fast-track interview invites
            </div>
          </div>

          <div className="auth-branding-footer">
            <span>Free registration • Instant verification • Verified companies</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Join JobPortal to unlock tailored career opportunities.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Role Toggle Tabs */}
          <div className="role-toggle-group">
            <button
              type="button"
              className={`role-toggle-btn ${role === 'candidate' ? 'active' : ''}`}
              onClick={() => setRole('candidate')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <IconUser size={15} /> Candidate (Job Seeker)
            </button>
            <button
              type="button"
              className={`role-toggle-btn ${role === 'recruiter' ? 'active' : ''}`}
              onClick={() => setRole('recruiter')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <IconBuilding size={15} /> Recruiter (Employer)
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name / Company Representative *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Work / Personal Email Address *</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ margin: 0 }}>Password *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ padding: '0.85rem', marginTop: '1.25rem' }}
              disabled={loading}
            >
              {loading ? 'Creating your account...' : 'Create Free Account'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
