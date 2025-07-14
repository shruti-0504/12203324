import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Box
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const UrlList = ({ urls }) => {
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (urls.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Shortened URLs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No URLs shortened yet. Create your first shortened URL above!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Shortened URLs ({urls.length})
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Original URL</TableCell>
              <TableCell>Shortened URL</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Typography variant="body2" noWrap>
                      {url.originalUrl}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {url.shortUrl}
                    </Typography>
                    <Tooltip title="Copy URL">
                      <IconButton
                        size="small"
                        onClick={() => handleCopy(url.shortUrl)}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(url.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="Copy original URL">
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(url.originalUrl)}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UrlList; 