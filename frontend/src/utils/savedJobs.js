// Helper utility to manage bookmarked / saved jobs scoped per logged-in user

const SAVED_JOBS_KEY_PREFIX = 'jobportal_saved_jobs';

const getStorageKey = () => {
  const userId = localStorage.getItem('userId');
  return userId ? `${SAVED_JOBS_KEY_PREFIX}_${userId}` : null;
};

export const getSavedJobs = () => {
  try {
    const key = getStorageKey();
    if (!key) return [];
    const raw = localStorage.getItem(key);
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
  const key = getStorageKey();
  if (!key) {
    // If not logged in, do not persist bookmarks across sessions
    return false;
  }

  const saved = getSavedJobs();
  let updated;
  if (saved.includes(jobId)) {
    updated = saved.filter((id) => id !== jobId);
  } else {
    updated = [...saved, jobId];
  }
  
  localStorage.setItem(key, JSON.stringify(updated));
  window.dispatchEvent(new Event('savedJobsChanged'));
  return !saved.includes(jobId);
};

export const clearSavedJobs = (userId) => {
  const key = userId ? `${SAVED_JOBS_KEY_PREFIX}_${userId}` : getStorageKey();
  if (key) {
    localStorage.removeItem(key);
    window.dispatchEvent(new Event('savedJobsChanged'));
  }
};
