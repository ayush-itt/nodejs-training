const notFound = (req, res, next) => {
    const error = new Error(`404 Not Found!! ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    res.status(err.status ?? 500).json({
        error: err.message,
        status: err.status ?? 500,
    });
};

module.exports = { notFound, errorHandler };
