const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' ? 'File too large' : err.message,
    });
  }
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }
  const status = err.statusCode || 500;
  const message =
    err.message ||
    (err.name === 'ValidationError' ? 'Validation error' : 'Server error');
  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
