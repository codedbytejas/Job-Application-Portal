import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import Toast from '../components/Toast';
import ShareModal from '../components/ShareModal';
import Footer from '../components/Footer';
import { DEMO_JOBS } from '../data/demoJobs';
import { getSavedJobs } from '../utils/savedJobs';
import {
  IconSearch,
  IconMapPin,
  IconBookmark,
  IconBuilding,
  IconBriefcase,
  IconDollar,
  IconUser,
  IconFilter
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
  const [selectedJobTypes, setSelectedJobTypes] = useState(searchParams.get('jobType') ? [searchParams.get('jobType')] : []);
  const [selectedWorkplace, setSelectedWorkplace] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState(searchParams.get('location') ? [searchParams.get('location')] : []);
  const [selectedSalary, setSelectedSalary] = useState('');
  const [onlySaved, setOnlySaved] = useState(searchParams.get('saved') === 'true');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Toast & Share Modal
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [shareJob, setShareJob] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // 1. Fetch Backend & Demo Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/jobs`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (res.data && res.data.length > 0) {
          // Merge real backend jobs with rich demo jobs
          setAllJobs([...res.data, ...DEMO_JOBS]);
        } else {
          setAllJobs(DEMO_JOBS);
        }
      } catch (err) {
        setAllJobs(DEMO_JOBS);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Update search from URL query if changed externally
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword');
    const urlLocation = searchParams.get('location');
    const urlJobType = searchParams.get('jobType');
    if (urlKeyword !== null) setKeyword(urlKeyword);
    if (urlLocation !== null) {
      setLocationInput(urlLocation);
      setSelectedLocations([urlLocation]);
    }
    if (urlJobType) setSelectedJobTypes([urlJobType]);
  }, [searchParams]);

  // 2. Perform Advanced Filtering
  useEffect(() => {
    let result = [...allJobs];

    // Filter by Keyword (title, company, description, skills, category)
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      result = result.filter(
        (job) =>
          (job.title && job.title.toLowerCase().includes(q)) ||
          (job.company && job.company.toLowerCase().includes(q)) ||
          (job.description && job.description.toLowerCase().includes(q)) ||
          (job.category && job.category.toLowerCase().includes(q)) ||
          (job.skills && job.skills.some((s) => s.toLowerCase().includes(q)))
      );
    }

    // Filter by Location input
    if (locationInput.trim()) {
      const loc = locationInput.toLowerCase().trim();
      result = result.filter(
        (job) => job.location && job.location.toLowerCase().includes(loc)
      );
    }

    // Filter by Workplace (Remote, Hybrid, On-site)
    if (selectedWorkplace.length > 0) {
      result = result.filter((job) => {
        const wp = job.workplaceType || (job.location?.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid');
        return selectedWorkplace.includes(wp);
      });
    }

    // Filter by Employment Type (Full Time, Part Time, Internship)
    if (selectedJobTypes.length > 0) {
      result = result.filter((job) => {
        const jt = job.jobType || 'Full Time';
        return selectedJobTypes.includes(jt);
      });
    }

    // Filter by Experience Level
    if (selectedExperience.length > 0) {
      result = result.filter((job) => {
        const exp = job.experience || '1-2 Years';
        return selectedExperience.some((e) => exp.toLowerCase().includes(e.toLowerCase()));
      });
    }

    // Filter by Selected Location checkboxes
    if (selectedLocations.length > 0) {
      result = result.filter((job) =>
        selectedLocations.some((l) => (job.location || '').toLowerCase().includes(l.toLowerCase()))
      );
    }

    // Filter by Salary Bracket
    if (selectedSalary) {
      if (selectedSalary === '3-6') {
        result = result.filter((job) => (job.salary || '').includes('3') || (job.salary || '').includes('4') || (job.salary || '').includes('5') || (job.salary || '').includes('6'));
      } else if (selectedSalary === '6-10') {
        result = result.filter((job) => (job.salary || '').includes('6') || (job.salary || '').includes('7') || (job.salary || '').includes('8') || (job.salary || '').includes('9'));
      } else if (selectedSalary === '10+') {
        result = result.filter((job) => (job.salary || '').includes('10') || (job.salary || '').includes('11') || (job.salary || '').includes('12') || (job.salary || '').includes('14'));
      }
    }

    // Filter by Saved Only
    if (onlySaved) {
      const savedIds = getSavedJobs();
      result = result.filter((job) => savedIds.includes(job._id));
    }

    // Sort Results
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    // Deduplicate jobs by _id
    const uniqueMap = new Map();
    result.forEach((item) => {
      if (item._id && !uniqueMap.has(item._id)) {
        uniqueMap.set(item._id, item);
      }
    });

    setFilteredJobs(Array.from(uniqueMap.values()));
  }, [
    allJobs,
    keyword,
    locationInput,
    selectedJobTypes,
    selectedWorkplace,
    selectedExperience,
    selectedLocations,
    selectedSalary,
    onlySaved,
    sortBy
  ]);

  // Checkbox toggle helper
  const handleCheckboxChange = (setter, currentList, value) => {
    if (currentList.includes(value)) {
      setter(currentList.filter((item) => item !== value));
    } else {
      setter([...currentList, value]);
    }
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocationInput('');
    setSelectedJobTypes([]);
    setSelectedWorkplace([]);
    setSelectedExperience([]);
    setSelectedLocations([]);
    setSelectedSalary('');
    setOnlySaved(false);
    setSearchParams({});
  };

  const activeFilterCount =
    (keyword ? 1 : 0) +
    (locationInput ? 1 : 0) +
    selectedJobTypes.length +
    selectedWorkplace.length +
    selectedExperience.length +
    selectedLocations.length +
    (selectedSalary ? 1 : 0) +
    (onlySaved ? 1 : 0);

  return (
    <div className="jobs-page-root">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {shareJob && (
        <ShareModal
          job={shareJob}
          onClose={() => setShareJob(null)}
          onShowToast={showToast}
        />
      )}

      <div className="container">
        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <span className="section-eyebrow">CAREER SEARCH ENGINE</span>
            <h1 className="page-title">Explore Verified Job Openings</h1>
            <p className="page-subtitle">
              Filter by tech stack, workplace preference, experience level, and direct recruiter postings.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className={`btn ${onlySaved ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setOnlySaved(!onlySaved)}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <IconBookmark size={15} fill={onlySaved ? 'currentColor' : 'none'} />
              <span>{onlySaved ? 'Showing Saved Jobs' : 'Filter Saved Jobs'}</span>
            </button>
          </div>
        </div>

        {/* Enhanced Dual Search Bar */}
        <div className="search-bar-container">
          <div className="search-input-group" style={{ flex: 1.6 }}>
            <span className="search-icon">
              <IconSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by role, programming language, skill, or employer..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => setKeyword('')}
                aria-label="Clear keyword"
              >
                ×
              </button>
            )}
          </div>

          <div className="search-input-group">
            <span className="search-icon">
              <IconMapPin size={18} />
            </span>
            <input
              type="text"
              placeholder="Location or 'Remote'..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            {locationInput && (
              <button
                type="button"
                className="input-clear-btn"
                onClick={() => setLocationInput('')}
                aria-label="Clear location"
              >
                ×
              </button>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {}}
            style={{ padding: '0.7rem 1.6rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <IconSearch size={16} /> Find Jobs
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="quick-chips-row">
          <span className="quick-chips-label">Quick Filters:</span>
          <button
            className={`quick-chip ${selectedWorkplace.includes('Remote') ? 'active' : ''}`}
            onClick={() => handleCheckboxChange(setSelectedWorkplace, selectedWorkplace, 'Remote')}
          >
            Remote Only
          </button>
          <button
            className={`quick-chip ${selectedExperience.includes('Fresher') ? 'active' : ''}`}
            onClick={() => handleCheckboxChange(setSelectedExperience, selectedExperience, 'Fresher')}
          >
            Fresher / Entry Level
          </button>
          <button
            className={`quick-chip ${selectedJobTypes.includes('Internship') ? 'active' : ''}`}
            onClick={() => handleCheckboxChange(setSelectedJobTypes, selectedJobTypes, 'Internship')}
          >
            Internships
          </button>
          <button
            className={`quick-chip ${selectedSalary === '10+' ? 'active' : ''}`}
            onClick={() => setSelectedSalary(selectedSalary === '10+' ? '' : '10+')}
          >
            High Salary (₹10+ LPA)
          </button>
        </div>

        {/* Active Removable Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="active-filters-bar">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Active Filters ({activeFilterCount}):
            </span>
            {keyword && (
              <span className="active-filter-tag">
                Keyword: "{keyword}" <button onClick={() => setKeyword('')}>×</button>
              </span>
            )}
            {locationInput && (
              <span className="active-filter-tag">
                Location: "{locationInput}" <button onClick={() => setLocationInput('')}>×</button>
              </span>
            )}
            {selectedJobTypes.map((t) => (
              <span key={t} className="active-filter-tag">
                {t} <button onClick={() => handleCheckboxChange(setSelectedJobTypes, selectedJobTypes, t)}>×</button>
              </span>
            ))}
            {selectedWorkplace.map((w) => (
              <span key={w} className="active-filter-tag">
                {w} <button onClick={() => handleCheckboxChange(setSelectedWorkplace, selectedWorkplace, w)}>×</button>
              </span>
            ))}
            {selectedExperience.map((e) => (
              <span key={e} className="active-filter-tag">
                Exp: {e} <button onClick={() => handleCheckboxChange(setSelectedExperience, selectedExperience, e)}>×</button>
              </span>
            ))}
            {selectedSalary && (
              <span className="active-filter-tag">
                Salary: {selectedSalary} LPA <button onClick={() => setSelectedSalary('')}>×</button>
              </span>
            )}
            {onlySaved && (
              <span className="active-filter-tag">
                Saved Jobs Only <button onClick={() => setOnlySaved(false)}>×</button>
              </span>
            )}
            <button className="clear-all-text-btn" onClick={handleResetFilters}>
              Reset All
            </button>
          </div>
        )}

        {/* Main Split Layout: Filter Sidebar + Job Results */}
        <div className="jobs-page-layout">
          {/* Left Filter Sidebar */}
          <aside className="filter-sidebar">
            <div className="filter-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.05rem', fontWeight: 700 }}>
                <IconFilter size={18} /> Filter Positions
              </h3>
              {activeFilterCount > 0 && (
                <button className="btn-reset-filter" onClick={handleResetFilters}>
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Workplace Type */}
            <div className="filter-group">
              <h4 className="filter-group-title">Workplace Mode</h4>
              {['Remote', 'Hybrid', 'On-site'].map((type) => (
                <label key={type} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedWorkplace.includes(type)}
                    onChange={() => handleCheckboxChange(setSelectedWorkplace, selectedWorkplace, type)}
                  />
                  <span className="filter-label">{type}</span>
                </label>
              ))}
            </div>

            {/* Job Type */}
            <div className="filter-group">
              <h4 className="filter-group-title">Employment Type</h4>
              {['Full Time', 'Part Time', 'Internship'].map((type) => (
                <label key={type} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedJobTypes.includes(type)}
                    onChange={() => handleCheckboxChange(setSelectedJobTypes, selectedJobTypes, type)}
                  />
                  <span className="filter-label">{type}</span>
                </label>
              ))}
            </div>

            {/* Experience Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Experience Level</h4>
              {['Fresher', '1-2 Years', '3-5 Years'].map((exp) => (
                <label key={exp} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedExperience.includes(exp)}
                    onChange={() => handleCheckboxChange(setSelectedExperience, selectedExperience, exp)}
                  />
                  <span className="filter-label">{exp}</span>
                </label>
              ))}
            </div>

            {/* Top Locations Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Popular Cities</h4>
              {['Mumbai', 'Pune', 'Bengaluru', 'Hyderabad'].map((loc) => (
                <label key={loc} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => handleCheckboxChange(setSelectedLocations, selectedLocations, loc)}
                  />
                  <span className="filter-label">{loc}</span>
                </label>
              ))}
            </div>

            {/* Salary Filter */}
            <div className="filter-group" style={{ marginBottom: 0 }}>
              <h4 className="filter-group-title">Salary Range</h4>
              <label className="filter-option">
                <input
                  type="radio"
                  name="salary"
                  checked={selectedSalary === ''}
                  onChange={() => setSelectedSalary('')}
                />
                <span className="filter-label">All Ranges</span>
              </label>
              {[
                { id: '3-6', label: '₹3 - ₹6 LPA' },
                { id: '6-10', label: '₹6 - ₹10 LPA' },
                { id: '10+', label: '₹10+ LPA (High Pay)' }
              ].map((sal) => (
                <label key={sal.id} className="filter-option">
                  <input
                    type="radio"
                    name="salary"
                    checked={selectedSalary === sal.id}
                    onChange={() => setSelectedSalary(sal.id)}
                  />
                  <span className="filter-label">{sal.label}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Right Job Results Area */}
          <main className="job-results-main">
            {/* Results Control Bar */}
            <div className="results-control-bar">
              <span className="results-count-text">
                Showing <strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? 'position' : 'positions'}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="sort-dropdown-wrapper">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">Newest First</option>
                    <option value="title">Role Title (A-Z)</option>
                  </select>
                </div>

                <div className="view-mode-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    Grid
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading-state-box">
                <div className="spinner"></div>
                <p>Loading active job listings...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="dashboard-card empty-results-card">
                <div style={{ display: 'inline-flex', padding: '1rem', background: '#f1f5f9', borderRadius: '50%', color: '#64748b', marginBottom: '1rem' }}>
                  <IconSearch size={28} />
                </div>
                <h3>No matching job openings found</h3>
                <p>
                  We couldn't find any opportunities matching your active filters. Try broadening your keywords or reset all filters.
                </p>
                <button className="btn btn-primary" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'job-grid' : 'job-list'}>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onShare={(j) => setShareJob(j)}
                    onShowToast={showToast}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer onShowToast={showToast} />
    </div>
  );
}

export default Jobs;
