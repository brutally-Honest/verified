const errorHandler = (error, req, res) => {
  if (error) {
    const errorName = error.errorName === "Validation Error";
    const jsonResponse = {
      statusCode: error.statusCode || 500,
      name: error.errorName || "Internal Server error",
      ...(!errorName && { message: error.message || "Something went wrong" }),
      ...(errorName && { details: { ...error.errorDetails } }),
    };
    res.status(error?.statusCode).json(jsonResponse);
  }
};

module.exports = { errorHandler };
