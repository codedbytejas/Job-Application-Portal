// Helper utility to manage bookmarked / saved jobs in localStorage

const SAVED_JOBS_KEY = 'jobportal_saved_jobs';

export const getSavedJobs = () => {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const isJobSaved = (jobId) => {
  const saved = getSavedJobs();
  return saved.includes(jobId);
};

export const toggleSaveJob = (jobId) => {
  const saved = getSavedJobs();
  let updated;
  if (saved.includes(jobId)) {
    updated = saved.filter((id) => id !== jobId);
  } else {
    updated = [...saved, jobId];
  }
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('savedJobsChanged'));
  return !saved.includes(jobId);
};
