class ApiError extends Error {

  constructor(code, message, status = 500) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

module.exports = { ApiError };