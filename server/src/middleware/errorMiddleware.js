function notFoundHandler(req, res, _next) {
    res.status(404).json({
        error: `Not Found - ${req.originalUrl}`,
    });
}

function errorHandler(err, _req, res, _next) {
    console.error("Unhandled Error:", err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        error: err.message || "Internal Server Error",
    });
}

module.exports = {
    notFoundHandler,
    errorHandler,
};
