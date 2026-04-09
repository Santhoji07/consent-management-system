import API from '../services/api';

// Consent API endpoints
// Note: These match the backend routes in consentRoutes.js
export const consentApi = {
  // Create a new consent (USER role)
  createConsent: (consentData) => API.post('/consent/create', consentData),
  
  // Update an existing consent (USER role)
  updateConsent: (consentData) => API.put('/consent/update', consentData),
  
  // Revoke a consent (USER role)
  revokeConsent: (consentId) => API.post('/consent/revoke', { consentId }),
  
  // Request access to a consent (ORG role) - triggers policy evaluation
  requestAccess: (requestData) => API.post('/consent/request-access', requestData),
  
  // Get consent history (ADMIN role)
  getHistory: (consentId) => API.get(`/consent/history/${consentId}`),
  
  // Get all enforcement logs (ADMIN role)
  getEnforcements: () => API.get('/consent/enforcements'),
  
  // Query a consent by ID (USER/ADMIN roles)
  queryConsent: (consentId) => API.get(`/consent/${consentId}`)
};

export default consentApi;

