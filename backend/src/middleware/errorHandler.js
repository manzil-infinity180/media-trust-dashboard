export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 100MB'
      });
    }
    return res.status(400).json({
      error: 'Upload error',
      message: err.message
    });
  }

  // Custom file filter errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message
    });
  }

  // Database errors
  if (err.code && err.code.startsWith('SQLITE_')) {
    return res.status(500).json({
      error: 'Database error',
      message: 'An error occurred while accessing the database'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
};
