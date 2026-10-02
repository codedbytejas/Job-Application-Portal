// Helper utility to store applicant status overrides & candidate profile info

const APPLICANT_STATUS_KEY = 'jobportal_applicant_statuses';
const CANDIDATE_PROFILE_KEY = 'jobportal_candidate_profile';

export const getApplicantStatuses = () => {
  try {
    const raw = localStorage.getItem(APPLICANT_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const setApplicantStatus = (applicantId, status) => {
  const statuses = getApplicantStatuses();
  statuses[applicantId] = status;
  localStorage.setItem(APPLICANT_STATUS_KEY, JSON.stringify(statuses));
  window.dispatchEvent(new Event('applicantStatusesChanged'));
};

export const getCandidateProfile = (userId) => {
  try {
    const key = `${CANDIDATE_PROFILE_KEY}_${userId || 'default'}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const saveCandidateProfile = (userId, profileData) => {
  const key = `${CANDIDATE_PROFILE_KEY}_${userId || 'default'}`;
  localStorage.setItem(key, JSON.stringify(profileData));
};
