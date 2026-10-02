import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconBriefcase, IconShield, IconZap, IconCheck } from './Icons';

function Footer({ onShowToast }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      if (onShowToast) onShowToast('Subscribed to weekly job alerts!', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-top-banner">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', padding: '1.75rem 1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
              Get Daily Job Alerts in Your Inbox
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
              Never miss verified opportunities matching your skills and preferred salary.
            </p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', minWidth: '320px', maxWidth: '480px', flex: 1 }}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
              style={{ background: '#ffffff', border: 'none', padding: '0.65rem 1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap', padding: '0.65rem 1.25rem', background: '#2563eb' }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem 1.5rem' }}>
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ background: 'var(--primary-color)', color: '#fff', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>
                <IconBriefcase size={18} />
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Job<span style={{ color: 'var(--primary-color)' }}>Portal</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              A modern career ecosystem connecting ambitious talent with industry-leading employers. Streamlined recruitment, verified salaries, and direct applications.
            </p>
            <div className="trust-pills" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <span className="badge-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <IconShield size={13} /> 100% Verified Posts
              </span>
              <span className="badge-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <IconZap size={13} /> Fast Response
              </span>
              <span className="badge-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <IconCheck size={13} /> Privacy Protected
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h5>For Job Seekers</h5>
            <ul>
              <li><Link to="/jobs">Browse Tech Jobs</Link></li>
              <li><Link to="/jobs?jobType=Internship">Internship Programs</Link></li>
              <li><Link to="/candidate-dashboard">Application Status</Link></li>
              <li><Link to="/register">Create Free Profile</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>For Employers</h5>
            <ul>
              <li><Link to="/add-job">Post a Job Opening</Link></li>
              <li><Link to="/recruiter-dashboard">Recruiter Dashboard</Link></li>
              <li><Link to="/login">Recruiter Sign In</Link></li>
              <li><Link to="/register">Employer Registration</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Top Locations</h5>
            <ul>
              <li><Link to="/jobs?location=Mumbai">Jobs in Mumbai</Link></li>
              <li><Link to="/jobs?location=Bengaluru">Jobs in Bengaluru</Link></li>
              <li><Link to="/jobs?location=Pune">Jobs in Pune</Link></li>
              <li><Link to="/jobs?location=Hyderabad">Jobs in Hyderabad</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 JobPortal Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Security & Compliance</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
