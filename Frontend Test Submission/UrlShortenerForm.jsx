import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Typography,
  Alert
} from '@mui/material';
import { shortenUrl } from '../utils/api';

const UrlShortenerForm = ({ onSuccess }) => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await shortenUrl(url);
      const newShortUrl = `${window.location.origin}/${data.shortCode}`;
      setShortUrl(newShortUrl);
      onSuccess({
        originalUrl: url,
        shortUrl: newShortUrl,
        shortCode: data.shortCode,
        createdAt: new Date().toISOString(),
      });
      setUrl('');
    } catch (err) {
      setError(err.message || 'Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Shorten Your URL
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Enter URL to shorten"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very-long-url"
          variant="outlined"
          required
          sx={{ mb: 2 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading || !url}
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {shortUrl && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Your shortened URL:
          </Typography>
          <TextField
            fullWidth
            value={shortUrl}
            variant="outlined"
            size="small"
            InputProps={{
              readOnly: true,
            }}
          />
        </Alert>
      )}
    </Paper>
  );
};

export default UrlShortenerForm; 