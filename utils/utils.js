const { ValidationError, CastError } = require('mongoose').Error;
const Session = require('../models/session');
const { ApiError } = require('./errors');

async function initSession(userId) {
  const token = await Session.generateToken();
  const session = new Session({ token, userId });
  await session.save();
  return session;
}

function handleError(res, error, defaultError) {
  let code, message, status = 500;
  if (error instanceof ValidationError) {
    let details = Object.keys(error.errors).map(errorKey => {
      let { path } = error.errors[errorKey];
      return {
        message: `'${path}' field is required`,
        path: [path],
        value: null,
      };
    });

    res.status(400)
      .json({
        code: 'CREATE_PAYMENT_ERROR',
        message: error._message,
        details,
      });

  } else if (error instanceof ApiError) {
    code = error.code;
    message = error.message;
    status = error.status;

  } else if (error instanceof CastError) {
    code = 'NOT_FOUND';
    message = 'Not Found';
    status = 404;

  } else if (defaultError) {
    code = defaultError.code;
    message = defaultError.message;

  } else {
    code = 'ERROR';
    message = error._message;
  }

  res.status(status)
    .json({ code, message });
}

module.exports = { initSession, handleError };