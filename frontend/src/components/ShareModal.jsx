import React, { useState } from 'react';
import { IconMapPin, IconCheck } from './Icons';

function ShareModal({ job, onClose, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const jobUrl = window.location.origin + `/jobs/${job._id}`;
  const shareText = `Check out this opening for ${job.title} at ${job.company} on JobPortal!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    if (onShowToast) onShowToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + jobUrl)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Share Job Opening</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <div style={{ margin: '1.25rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', padding: '0.75rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
            <div
              className="job-company-avatar"
              style={{
                width: 44,
                height: 44,
                fontSize: '1.1rem',
                backgroundColor: job.companyColor || '#1e40af'
              }}
            >
              {job.companyInitial || job.company?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{job.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                {job.company} • <IconMapPin size={13} /> {job.location}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              className="btn btn-secondary share-btn"
              onClick={handleShareWhatsApp}
              style={{ padding: '0.65rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
            >
              WhatsApp
            </button>
            <button
              className="btn btn-secondary share-btn"
              onClick={handleShareLinkedIn}
              style={{ padding: '0.65rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
            >
              LinkedIn
            </button>
            <button
              className="btn btn-secondary share-btn"
              onClick={handleShareTwitter}
              style={{ padding: '0.65rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
            >
              X (Twitter)
            </button>
          </div>

          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
            Direct Job Link
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              value={jobUrl}
              className="form-control"
              style={{ fontSize: '0.85rem', padding: '0.55rem' }}
            />
            <button
              className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
              onClick={handleCopy}
              style={{ minWidth: '95px', padding: '0.55rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
            >
              {copied ? <><IconCheck size={14} /> Copied</> : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
