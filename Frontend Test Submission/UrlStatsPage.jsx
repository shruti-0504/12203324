import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getUrlStats } from '../utils/api';

const UrlStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getUrlStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Mock data for demonstration
  const mockStats = {
    totalUrls: 150,
    totalClicks: 2847,
    averageClicks: 18.98,
    topUrls: [
      { shortCode: 'abc123', originalUrl: 'https://example.com', clicks: 245 },
      { shortCode: 'def456', originalUrl: 'https://google.com', clicks: 189 },
      { shortCode: 'ghi789', originalUrl: 'https://github.com', clicks: 156 },
    ],
    clicksByDay: [
      { date: '2024-01-01', clicks: 45 },
      { date: '2024-01-02', clicks: 67 },
      { date: '2024-01-03', clicks: 89 },
      { date: '2024-01-04', clicks: 123 },
      { date: '2024-01-05', clicks: 156 },
    ]
  };

  const displayStats = stats || mockStats;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total URLs
              </Typography>
              <Typography variant="h4">
                {displayStats.totalUrls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Clicks
              </Typography>
              <Typography variant="h4">
                {displayStats.totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Clicks
              </Typography>
              <Typography variant="h4">
                {displayStats.averageClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active URLs
              </Typography>
              <Typography variant="h4">
                {displayStats.topUrls.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Clicks by Day
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={displayStats.clicksByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing URLs
            </Typography>
            <Box>
              {displayStats.topUrls.map((url, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {url.shortCode}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {url.originalUrl}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {url.clicks} clicks
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UrlStatsPage;
