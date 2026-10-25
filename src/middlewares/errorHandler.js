export const httpError = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });

export const errorHandler = (error, req, res, next) => {
  const duplicate = error.code === 11000;
  const statusCode = duplicate ? 409 : error.statusCode || error.status || 500;
  const message = duplicate
    ? "A record with that value already exists"
    : statusCode >= 500
      ? "Internal server error"
      : error.message;

  if (statusCode >= 500) console.error(error);

  res.status(statusCode).json({
    status: "ERROR",
    message,
  });
};
