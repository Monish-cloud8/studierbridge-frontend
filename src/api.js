import axios from 'axios';

const API_BASE_URL = 'https://studierbridge-backend-production.up.railway.app/api';
// Signup API call
export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Signup failed';
  }
};

// Login API call
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Login failed';
  }
};
  // Get all mentors
export const getMentors = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mentors`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch mentors';
  }
};
// Get user profile
export const getProfile = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch profile';
  }
};

// Update subjects
export const updateSubjects = async (email, subjects) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/subjects`, {
      email,
      subjects
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to update subjects';
  }
};
// Create session request
export const createSessionRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/session-request`, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to create session request';
  }
};

// Get sessions for a user
export const getSessions = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch sessions';
  }
};
// Update session status
export const updateSessionStatus = async (sessionId, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/session-status`, {
      session_id: sessionId,
      status: status
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to update session status';
  }
};
// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to update profile';
  }
};

// Upload profile picture
export const uploadProfilePicture = async (email, file) => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to upload profile picture';
  }
};
// Get notifications
export const getNotifications = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch notifications';
  }
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/notifications/read/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to mark notification as read';
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async (email) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/notifications/read-all/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to mark all notifications as read';
  }
};
// Set mentor availability
export const setAvailability = async (email, timeSlots) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/availability`, {
      email,
      time_slots: timeSlots
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to set availability';
  }
};

// Get mentor availability
export const getAvailability = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/availability/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to get availability';
  }
};

// Create scheduled session request
export const createScheduledSessionRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/session-request-scheduled`, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to create session request';
  }
};

// Get upcoming sessions
export const getUpcomingSessions = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upcoming-sessions/${email}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch upcoming sessions';
  }
};
// Get all mentees
export const getMentees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mentees`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || 'Failed to fetch mentees';
  }
};