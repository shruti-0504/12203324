// URL validation function
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// URL normalization function
export const normalizeUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

// Short code validation
export const isValidShortCode = (code) => {
  // Allow alphanumeric characters and hyphens, 3-10 characters long
  const shortCodeRegex = /^[a-zA-Z0-9-]{3,10}$/;
  return shortCodeRegex.test(code);
};

// Generate a random short code
export const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate form inputs
export const validateUrlForm = (url, customCode = '') => {
  const errors = {};

  if (!url) {
    errors.url = 'URL is required';
  } else if (!isValidUrl(url)) {
    errors.url = 'Please enter a valid URL';
  }

  if (customCode && !isValidShortCode(customCode)) {
    errors.customCode = 'Custom code must be 3-10 characters long and contain only letters, numbers, and hyphens';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize input
export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

// Check if URL is accessible (basic check)
export const checkUrlAccessibility = async (url) => {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' // This is a limitation of CORS, but we can still check if the URL format is valid
    });
    return true;
  } catch (error) {
    // If we can't access the URL due to CORS, we'll assume it's valid if the format is correct
    return isValidUrl(url);
  }
};

// Rate limiting helper
export const createRateLimiter = (maxRequests = 10, timeWindow = 60000) => {
  const requests = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the time window
    const recentRequests = userRequests.filter(time => now - time < timeWindow);
    
    if (recentRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    return true; // Request allowed
  };
};
  