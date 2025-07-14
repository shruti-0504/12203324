const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API functions
export const shortenUrl = async (originalUrl) => {
  const response = await fetch(`${API_BASE_URL}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ originalUrl }),
  });
  return handleResponse(response);
};

export const getUrlStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  return handleResponse(response);
};

export const getUrlByCode = async (shortCode) => {
  const response = await fetch(`${API_BASE_URL}/url/${shortCode}`);
  return handleResponse(response);
};

export const updateUrlClicks = async (shortCode) => {
  const response = await fetch(`${API_BASE_URL}/url/${shortCode}/click`, {
    method: 'POST',
  });
  return handleResponse(response);
};

export const deleteUrl = async (shortCode) => {
  const response = await fetch(`${API_BASE_URL}/url/${shortCode}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getUrlsByUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/urls`);
  return handleResponse(response);
};

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    success: false,
    message: error.message || 'An unexpected error occurred',
  };
};
