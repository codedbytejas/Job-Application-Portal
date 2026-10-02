import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import Toast from '../components/Toast';
import ShareModal from '../components/ShareModal';
import CompanyModal from '../components/CompanyModal';
import Footer from '../components/Footer';
import { DEMO_JOBS, TOP_COMPANIES, JOB_CATEGORIES, TESTIMONIALS } from '../data/demoJobs';
import {
  IconSearch,
  IconMapPin,
  IconStar,
  IconBriefcase,
  IconBuilding,
  IconCode,
  IconLayers,
  IconDatabase,
  IconCpu,
  IconLock,
  IconTarget,
  IconZap,
  IconAward,
  IconChevronRight,
  IconTrendingUp
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function Home() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals & Toast State
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [shareJob, setShareJob] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const loadFeaturedJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/jobs`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (res.data && res.data.length > 0) {
          // Combine backend jobs with demo jobs
          setFeaturedJobs([...res.data, ...DEMO_JOBS]);
        } else {
          setFeaturedJobs(DEMO_JOBS);
        }
      } catch (err) {
        setFeaturedJobs(DEMO_JOBS);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickSearch = (tag) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/jobs?keyword=${encodeURIComponent(categoryName)}`);
  };

  // Filter jobs based on active home tab
  const getTabFilteredJobs = () => {
    if (activeTab === 'remote') {
      return featuredJobs.filter(
        (j) =>
          (j.workplaceType && j.workplaceType.toLowerCase() === 'remote') ||
          (j.location && j.location.toLowerCase().includes('remote'))
      );
    }
    if (activeTab === 'engineering') {
      return featuredJobs.filter(
        (j) =>
          (j.category && j.category.toLowerCase().includes('engineering')) ||
          (j.title && (j.title.toLowerCase().includes('engineer') || j.title.toLowerCase().includes('developer')))
      );
    }
    if (activeTab === 'fresher') {
      return featuredJobs.filter(
        (j) => (j.experience && j.experience.toLowerCase().includes('fresher')) || j.experience === '0-2 Years'
      );
    }
    return featuredJobs;
  };

  const displayedJobs = getTabFilteredJobs().slice(0, 6);

  const getCategoryIcon = (iconType) => {
    switch (iconType) {
      case 'code': return <IconCode size={24} />;
      case 'layers': return <IconLayers size={24} />;
      case 'database': return <IconDatabase size={24} />;
      case 'cpu': return <IconCpu size={24} />;
      case 'lock': return <IconLock size={24} />;
      case 'target': return <IconTarget size={24} />;
      default: return <IconBriefcase size={24} />;
    }
  };

  return (
    <div className="home-page-root">
      {/* Toast Alert */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Share Modal */}
      {shareJob && (
        <ShareModal
          job={shareJob}
          onClose={() => setShareJob(null)}
          onShowToast={showToast}
        />
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge-pill">
            <span className="live-dot"></span>
            <span>Over 1,200+ Verified Opportunities Available</span>
          </div>

          <h1 className="hero-title">
            Land Your Next Career Move with <span className="hero-highlight">Leading Tech Employers</span>
          </h1>

          <p className="hero-subtitle">
            Explore verified opportunities across enterprise IT organizations, high-growth startups, and flexible remote teams. Apply in seconds with instant recruiter tracking.
          </p>

          <form onSubmit={handleSearch} className="hero-search-box">
            <div className="search-input-group">
              <span className="search-icon">
                <IconSearch size={18} />
              </span>
              <input
                type="text"
                placeholder="Job title, skills (e.g. React, Node, Java)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="search-input-group">
              <span className="search-icon">
                <IconMapPin size={18} />
              </span>
              <input
                type="text"
                placeholder="Location (e.g. Mumbai, Bengaluru, Remote)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary hero-submit-btn">
              Search Openings
            </button>
          </form>

          {/* Quick Search Tag Pills */}
          <div className="hero-popular-tags">
            <span className="tags-label">Popular Searches:</span>
            {['React Developer', 'Node.js', 'Remote', 'Data Analyst', 'Software Engineer', 'Fresher'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="hero-tag-chip"
                onClick={() => handleQuickSearch(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Trust Numbers Strip */}
        <div className="hero-stats-strip">
          <div className="hero-stat-item">
            <span className="stat-number-bold">10,000+</span>
            <span className="stat-label-muted">Active Candidates</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <span className="stat-number-bold">450+</span>
            <span className="stat-label-muted">Verified Recruiters</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <span className="stat-number-bold">98%</span>
            <span className="stat-label-muted">Interview Match Rate</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat-item">
            <span className="stat-number-bold">₹8.5 LPA</span>
            <span className="stat-label-muted">Avg. Tech Salary</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container">
        {/* Explore Categories Section */}
        <section className="home-section">
          <div className="section-header-center">
            <span className="section-eyebrow">BROWSE BY DOMAIN</span>
            <h2 className="section-title">Explore Career Sectors</h2>
            <p className="section-subtitle">
              Discover verified vacancies tailored to your technical discipline and specialization.
            </p>
          </div>

          <div className="categories-grid">
            {JOB_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="category-icon" style={{ background: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getCategoryIcon(cat.iconType)}
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-count" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {cat.count}+ Open Roles <IconChevronRight size={13} />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Leading Companies Section */}
        <section id="companies" className="home-section">
          <div className="section-header-center">
            <span className="section-eyebrow">VERIFIED RECRUITERS</span>
            <h2 className="section-title">Top Hiring Companies</h2>
            <p className="section-subtitle">
              Directly connect with top enterprise organizations actively reviewing applications today.
            </p>
          </div>

          <div className="companies-grid">
            {TOP_COMPANIES.map((company) => (
              <div
                key={company.name}
                className="company-card"
                onClick={() => setSelectedCompany(company)}
              >
                <div className="company-card-top">
                  <div className="company-avatar" style={{ backgroundColor: company.color }}>
                    {company.initial}
                  </div>
                  <span className="company-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <IconStar size={13} fill="#d97706" /> {company.rating}
                  </span>
                </div>
                <div className="company-name">{company.name}</div>
                <p className="company-industry-tag">{company.industry}</p>
                <div className="company-opps">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <IconBriefcase size={14} /> {company.opportunities}
                  </span>
                  <span className="view-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    Details <IconChevronRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Jobs Section with Tabs */}
        <section className="home-section">
          <div className="page-header" style={{ alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <div>
              <span className="section-eyebrow">OPPORTUNITY SPOTLIGHT</span>
              <h2 className="section-title" style={{ marginBottom: '0.25rem' }}>
                Featured Job Openings
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Handpicked positions with verified salaries and direct recruiter access.
              </p>
            </div>
            <Link to="/jobs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Browse All Jobs ({featuredJobs.length}) <IconChevronRight size={14} />
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="job-tabs-container">
            <button
              className={`job-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconTrendingUp size={15} /> All Featured
            </button>
            <button
              className={`job-tab-btn ${activeTab === 'remote' ? 'active' : ''}`}
              onClick={() => setActiveTab('remote')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconBuilding size={15} /> Remote Opportunities
            </button>
            <button
              className={`job-tab-btn ${activeTab === 'engineering' ? 'active' : ''}`}
              onClick={() => setActiveTab('engineering')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconCode size={15} /> Engineering & Tech
            </button>
            <button
              className={`job-tab-btn ${activeTab === 'fresher' ? 'active' : ''}`}
              onClick={() => setActiveTab('fresher')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconAward size={15} /> Entry-Level / Fresher
            </button>
          </div>

          {loading ? (
            <div className="loading-state-box">
              <div className="spinner"></div>
              <p>Fetching active opportunities...</p>
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No jobs found in this category.</p>
            </div>
          ) : (
            <div className="job-grid">
              {displayedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onShare={(j) => setShareJob(j)}
                  onShowToast={showToast}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/jobs" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Explore All Available Vacancies <IconChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* How It Works 3-Step Guide */}
        <section className="home-section how-it-works-section">
          <div className="section-header-center">
            <span className="section-eyebrow">SIMPLIFIED WORKFLOW</span>
            <h2 className="section-title">How JobPortal Works</h2>
            <p className="section-subtitle">
              Everything you need to discover, apply, and get hired smoothly in 3 simple steps.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <IconTarget size={28} />
              </div>
              <h3>Explore Verified Roles</h3>
              <p>Filter through hundreds of openings by technology stack, experience, location, and transparent compensation.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                <IconZap size={28} />
              </div>
              <h3>1-Click Easy Apply</h3>
              <p>Upload your PDF resume once and apply directly to hiring managers without filling out tedious duplicate forms.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                <IconAward size={28} />
              </div>
              <h3>Track & Get Hired</h3>
              <p>Receive real-time progress updates from recruiter review to interview scheduling right in your dashboard.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="home-section">
          <div className="section-header-center">
            <span className="section-eyebrow">SUCCESS STORIES</span>
            <h2 className="section-title">Loved by Candidates & Employers</h2>
            <p className="section-subtitle">
              Read how job seekers landed their dream tech jobs and recruiters filled critical positions.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <span className="testimonial-badge">{t.badge}</span>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar" style={{ background: t.color || '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="author-name">{t.name}</h4>
                    <p className="author-role">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recruiter / Candidate Dual CTA Banner */}
        <section className="home-section">
          <div className="cta-dual-banner">
            <div className="cta-banner-card cta-candidate">
              <div className="cta-badge">For Candidates</div>
              <h3>Ready to Accelerate Your Career?</h3>
              <p>Create your candidate profile, browse top tech openings, and apply with instant recruiter visibility.</p>
              <Link to="/register" className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Join as Candidate <IconChevronRight size={14} />
              </Link>
            </div>

            <div className="cta-banner-card cta-recruiter">
              <div className="cta-badge cta-badge-purple">For Employers</div>
              <h3>Looking to Hire Verified Talent?</h3>
              <p>Post your job listings and connect with pre-screened developers and technical specialists instantly.</p>
              <Link to="/add-job" className="btn btn-secondary cta-recruiter-btn" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                Post a Job Opening <IconChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Modern Footer */}
      <Footer onShowToast={showToast} />
    </div>
  );
}

export default Home;
