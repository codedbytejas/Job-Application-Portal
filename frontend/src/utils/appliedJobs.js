// Utility to store and retrieve candidate applied jobs across backend & demo listings

const APPLIED_JOBS_KEY_PREFIX = 'jobportal_applied_jobs';

export const getLocalAppliedJobs = (userId) => {
  try {
    const key = `${APPLIED_JOBS_KEY_PREFIX}_${userId || 'default'}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveLocalAppliedJob = (userId, applicationData) => {
  try {
    const key = `${APPLIED_JOBS_KEY_PREFIX}_${userId || 'default'}`;
    const existing = getLocalAppliedJobs(userId);
    
    // Check if already applied to avoid duplicates
    const jobId = applicationData.job?._id || applicationData.jobId || applicationData.job;
    const filtered = existing.filter((item) => {
      const itemJobId = item.job?._id || item.jobId || item.job;
      return itemJobId !== jobId;
    });

    const updated = [applicationData, ...filtered];
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('appliedJobsChanged'));
    return updated;
  } catch (e) {
    console.error('Failed to save local application:', e);
    return [];
  }
};

export const isJobLocallyApplied = (userId, jobId) => {
  const existing = getLocalAppliedJobs(userId);
  return existing.some((item) => {
    const itemJobId = item.job?._id || item.jobId || item.job;
    return itemJobId === jobId;
  });
};
