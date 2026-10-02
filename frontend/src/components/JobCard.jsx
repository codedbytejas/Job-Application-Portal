import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isJobSaved, toggleSaveJob } from '../utils/savedJobs';
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
  IconChevronRight
} from './Icons';

function JobCard({ job, onShare, onShowToast }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isJobSaved(job._id));

    const handleSavedChange = () => {
      setSaved(isJobSaved(job._id));
    };

    window.addEventListener('savedJobsChanged', handleSavedChange);
    return () => window.removeEventListener('savedJobsChanged', handleSavedChange);
  }, [job._id]);

  const handleBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isNowSaved = toggleSaveJob(job._id);
    setSaved(isNowSaved);
    if (onShowToast) {
      onShowToast(
        isNowSaved ? 'Job saved to your bookmarks!' : 'Job removed from bookmarks',
        isNowSaved ? 'saved' : 'info'
      );
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(job);
    }
  };

  // Generate company initial and consistent color
  const companyName = job.company || 'Company';
  const initial = job.companyInitial || companyName.charAt(0).toUpperCase();

  const colors = ['#1e40af', '#0284c7', '#7c3aed', '#059669', '#ea580c', '#16a34a', '#b91c1c'];
  const charCode = companyName.charCodeAt(0) || 0;
  const avatarBg = job.companyColor || colors[charCode % colors.length];

  // Derive display values
  const salary = job.salary || 'Competitive';
  const jobType = job.jobType || 'Full Time';
  const experience = job.experience || '0-2 Years';
  const workplace = job.workplaceType || (job.location?.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid');

  // Extract skills snippet
  const skills = job.skills && Array.isArray(job.skills) ? job.skills.slice(0, 3) : [];

  return (
    <div className={`job-card ${job.featured ? 'job-card-featured' : ''}`}>
      <div>
        <div className="job-card-header">
          <div className="job-company-avatar" style={{ backgroundColor: avatarBg }}>
            {initial}
          </div>

          <div className="job-card-title-area">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <h3 className="job-title">
                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
              </h3>
              {job.featured && (
                <span className="badge-featured" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <IconStar size={12} fill="#d97706" /> Featured
                </span>
              )}
              {job.urgent && (
                <span className="badge-urgent" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Urgent
                </span>
              )}
            </div>
            <p className="job-company-name">
              {companyName} <span className="company-verified" title="Verified Employer"><IconCheck size={11} /></span>
            </p>
          </div>

          <div className="job-card-actions">
            <button
              className={`bookmark-btn ${saved ? 'bookmarked' : ''}`}
              onClick={handleBookmarkToggle}
              title={saved ? 'Remove from Saved Jobs' : 'Save Job'}
              aria-label="Save Job"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IconBookmark size={16} fill={saved ? 'var(--primary-color)' : 'none'} />
            </button>
            <button
              className="share-icon-btn"
              onClick={handleShareClick}
              title="Share Job"
              aria-label="Share Job"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <IconShare size={16} />
            </button>
          </div>
        </div>

        {/* Key Metadata Badges */}
        <div className="job-meta-grid">
          <span className="job-meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconMapPin size={14} /> {job.location}
          </span>
          <span className="job-meta-item job-meta-salary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconDollar size={14} /> {salary}
          </span>
          <span className="job-meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconBriefcase size={14} /> {jobType}
          </span>
          <span className={`job-meta-item workplace-pill workplace-${workplace.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconBuilding size={14} /> {workplace}
          </span>
          <span className="job-meta-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconUser size={14} /> {experience}
          </span>
        </div>

        {/* Short description */}
        <p className="job-description-snippet">
          {job.description}
        </p>

        {/* Skills preview tags */}
        {skills.length > 0 && (
          <div className="job-card-skills">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag-small">
                {skill}
              </span>
            ))}
            {job.skills && job.skills.length > 3 && (
              <span className="skill-tag-more">+{job.skills.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <div className="job-posted-info">
          <span className="job-posted-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <IconClock size={13} /> {job.createdAt ? `Posted ${new Date(job.createdAt).toLocaleDateString()}` : 'Recently posted'}
          </span>
          {job.applicantCount && (
            <span className="applicant-count-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <IconUsers size={13} /> {job.applicantCount} applicants
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {job.easyApply && (
            <span className="easy-apply-badge" title="Quick 1-step resume submission" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <IconZap size={12} /> Easy Apply
            </span>
          )}
          <Link
            to={`/jobs/${job._id}`}
            className="btn btn-primary"
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            View Details <IconChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
