import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getSavedJobs } from '../utils/savedJobs';
import { 
  IconBriefcase, 
  IconSearch, 
  IconBuilding, 
  IconBookmark, 
  IconFileText, 
  IconPlus 
} from './Icons';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const updateSaved = () => {
      setSavedCount(getSavedJobs().length);
    };
    updateSaved();

    window.addEventListener('savedJobsChanged', updateSaved);
    return () => window.removeEventListener('savedJobsChanged', updateSaved);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <div className="nav-brand">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="brand-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: '#fff', padding: '0.35rem', borderRadius: '8px' }}>
              <IconBriefcase size={20} />
            </span>
            <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
              Job<span className="brand-highlight">Portal</span>
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? 'nav-mobile-active' : ''}`}>
          <Link to="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <IconSearch size={16} /> Explore Jobs
          </Link>

          <a href="/#companies" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <IconBuilding size={16} /> Companies
          </a>

          {/* Saved Jobs Link with live badge */}
          {role !== 'recruiter' && (
            <Link
              to="/candidate-dashboard?tab=saved"
              className={`nav-link nav-saved-link ${location.search.includes('tab=saved') ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconBookmark size={16} /> Saved Jobs
              {savedCount > 0 && <span className="nav-saved-badge">{savedCount}</span>}
            </Link>
          )}

          {token ? (
            <>
              {role === 'candidate' && (
                <Link
                  to="/candidate-dashboard"
                  className={`nav-link ${isActive('/candidate-dashboard') || isActive('/candidate/dashboard') ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <IconFileText size={16} /> My Applications
                </Link>
              )}

              {role === 'recruiter' && (
                <>
                  <Link
                    to="/recruiter-dashboard"
                    className={`nav-link ${isActive('/recruiter-dashboard') || isActive('/recruiter/dashboard') ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <IconBriefcase size={16} /> Recruiter Hub
                  </Link>
                  <Link
                    to="/add-job"
                    className="btn btn-primary nav-post-btn"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <IconPlus size={16} /> Post a Job
                  </Link>
                </>
              )}

              {userName && (
                <div className="user-badge">
                  <div className="user-avatar-circle">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-text">{userName}</span>
                  <span className={`role-pill role-pill-${role}`}>{role}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="btn btn-secondary nav-logout-btn"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-secondary nav-login-btn">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary nav-reg-btn">
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
