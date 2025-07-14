const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage (replace with database in production)
const urlDatabase = new Map();
const statsDatabase = new Map();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Helper function to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to normalize URL
const normalizeUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

// API Routes

// Shorten URL
app.post('/api/shorten', (req, res) => {
  try {
    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const normalizedUrl = normalizeUrl(originalUrl);
    
    if (!isValidUrl(normalizedUrl)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate short code
    const shortCode = nanoid(6);
    
    // Store URL data
    const urlData = {
      originalUrl: normalizedUrl,
      shortCode,
      createdAt: new Date().toISOString(),
      clicks: 0,
      lastAccessed: null
    };
    
    urlDatabase.set(shortCode, urlData);
    
    // Initialize stats
    statsDatabase.set(shortCode, {
      clicks: 0,
      clickHistory: []
    });

    res.json({
      success: true,
      shortCode,
      originalUrl: normalizedUrl,
      shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect to original URL
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  
  const urlData = urlDatabase.get(shortCode);
  
  if (!urlData) {
    return res.status(404).json({ error: 'URL not found' });
  }

  // Update click count
  urlData.clicks += 1;
  urlData.lastAccessed = new Date().toISOString();
  
  // Update stats
  const stats = statsDatabase.get(shortCode);
  if (stats) {
    stats.clicks += 1;
    stats.clickHistory.push({
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  }

  res.redirect(urlData.originalUrl);
});

// Get URL stats
app.get('/api/stats', (req, res) => {
  try {
    const totalUrls = urlDatabase.size;
    const totalClicks = Array.from(urlDatabase.values()).reduce((sum, url) => sum + url.clicks, 0);
    const averageClicks = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(2) : 0;

    // Get top URLs by clicks
    const topUrls = Array.from(urlDatabase.entries())
      .map(([shortCode, data]) => ({
        shortCode,
        originalUrl: data.originalUrl,
        clicks: data.clicks
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Generate mock daily clicks data
    const clicksByDay = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      clicksByDay.push({
        date: date.toISOString().split('T')[0],
        clicks: Math.floor(Math.random() * 50) + 10
      });
    }

    res.json({
      totalUrls,
      totalClicks,
      averageClicks: parseFloat(averageClicks),
      topUrls,
      clicksByDay
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific URL data
app.get('/api/url/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  
  const urlData = urlDatabase.get(shortCode);
  
  if (!urlData) {
    return res.status(404).json({ error: 'URL not found' });
  }

  res.json(urlData);
});

// Update click count
app.post('/api/url/:shortCode/click', (req, res) => {
  const { shortCode } = req.params;
  
  const urlData = urlDatabase.get(shortCode);
  
  if (!urlData) {
    return res.status(404).json({ error: 'URL not found' });
  }

  urlData.clicks += 1;
  urlData.lastAccessed = new Date().toISOString();

  res.json({ success: true, clicks: urlData.clicks });
});

// Delete URL
app.delete('/api/url/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  
  const urlData = urlDatabase.get(shortCode);
  
  if (!urlData) {
    return res.status(404).json({ error: 'URL not found' });
  }

  urlDatabase.delete(shortCode);
  statsDatabase.delete(shortCode);

  res.json({ success: true, message: 'URL deleted successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    urlsCount: urlDatabase.size
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 URL Shortener API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 