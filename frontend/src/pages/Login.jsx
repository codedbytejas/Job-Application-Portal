import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast';
import { IconBriefcase, IconCheck, IconUser, IconBuilding, IconZap } from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDemoFill = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'candidate') {
      setEmail('alex.johnson@gmail.com');
      setPassword('Password@123');
    } else {
      setEmail('sarah.recruiter@google.com');
      setPassword('Password@123');
    }
    showToast(`Filled sample credentials for ${targetRole}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint =
        role === 'candidate'
          ? `${API_URL}/auth/candidate/login`
          : `${API_URL}/auth/recruiter/login`;

      const res = await axios.post(endpoint, { email, password });

      // Save user session in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name);

      showToast(`Welcome back, ${res.data.user.name}!`, 'success');

      setTimeout(() => {
        if (res.data.user.role === 'recruiter') {
          navigate('/recruiter-dashboard');
        } else {
          navigate('/candidate-dashboard');
        }
      }, 500);
    } catch (err) {
      setError(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Invalid credentials. Please verify your email and password.'
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
            <h2>Your next career move starts here.</h2>
            <p>
              Connect with top tech companies, submit verified applications with one click, and track your interview pipeline seamlessly.
            </p>
          </div>

          <div className="auth-perks-list">
            <div className="auth-perk-item">
              <span><IconCheck size={14} /></span> 100% verified employer listings
            </div>
            <div className="auth-perk-item">
              <span><IconCheck size={14} /></span> Direct recruiter tracking
            </div>
            <div className="auth-perk-item">
              <span><IconCheck size={14} /></span> Transparent salary indicators
            </div>
          </div>

          <div className="auth-branding-footer">
            <span>Trusted by thousands of professionals and hiring managers across India.</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your portal dashboard.</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

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
              <label>Email Address</label>
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
                <label style={{ margin: 0 }}>Password</label>
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
                placeholder="Enter your password"
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
              {loading ? 'Signing in securely...' : 'Sign In to Account'}
            </button>
          </form>

          {/* Demo Quick Fill Helper */}
          <div className="demo-credentials-box">
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <IconZap size={13} /> Quick Fill Sample Account:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => handleDemoFill('candidate')}
              >
                Candidate Sample
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => handleDemoFill('recruiter')}
              >
                Recruiter Sample
              </button>
            </div>
          </div>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
