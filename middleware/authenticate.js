const Session = require('../models/session');

const { ApiError } = require('../utils/errors');
const { handleError } = require('../utils/utils');

async function authenticate(req, res, next) {
  try {
    const token = req.get('Authorization');

    if (!token || !typeof token === 'string') {
      throw new ApiError('ERR_UNAUTHORIZED', 'No auth token provided', 401);
    }

    const session = await Session.findOne({ token, status: 'valid' });
    if (!session) {
      throw new ApiError('ERR_AUTH_TOKEN_EXPIRED', 'Auth token expired', 401);
    }

    next();
  } catch (error) {
    handleError(res, error);
  }
}

module.exports = { authenticate };