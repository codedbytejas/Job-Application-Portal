import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconStar, IconUsers, IconCheck, IconChevronRight } from './Icons';

function CompanyModal({ company, onClose }) {
  const navigate = useNavigate();

  if (!company) return null;

  const handleExploreJobs = () => {
    onClose();
    navigate(`/jobs?keyword=${encodeURIComponent(company.name)}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-card company-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              className="job-company-avatar"
              style={{
                width: 52,
                height: 52,
                fontSize: '1.4rem',
                backgroundColor: company.color || '#1e40af'
              }}
            >
              {company.initial || company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {company.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <IconStar size={13} fill="#d97706" /> {company.rating || '4.2'} ({company.reviews || '30K+'} reviews)
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <IconUsers size={13} /> {company.employees || '10,000+'} employees
                </span>
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <div style={{ margin: '1.25rem 0' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            "{company.tagline || 'Leading innovation and customer-centric technological advancement.'}"
          </div>

          <div className="company-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div className="info-box">
              <span className="info-label">Industry</span>
              <span className="info-value">{company.industry || 'Information Technology'}</span>
            </div>
            <div className="info-box">
              <span className="info-label">Headquarters</span>
              <span className="info-value">{company.location || 'India'}</span>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              Top Employee Benefits & Perks
            </h4>
            <div className="skills-container">
              {(company.benefits || ["Health Insurance", "Hybrid Flexibility", "Upskilling Stipend", "Performance Bonus"]).map((b, idx) => (
                <span key={idx} className="perk-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconCheck size={12} /> {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleExploreJobs} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            View Open Jobs at {company.name} <IconChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyModal;
