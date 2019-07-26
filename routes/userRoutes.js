const router = require('express').Router();
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { initSession, handleError } = require('../utils/utils');
const { ApiError } = require('../utils/errors');

/**
 * Authenticate user
 */
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user._id) {
      throw new ApiError('USER_NOT_FOUND', `User ${username} not found`, 401);
    }

    const passwordValidated = await bcrypt.compare(password, user.password);
    if (!passwordValidated) {
      throw new ApiError('INVALID_CREDENTIALS', 'Check username and password combination', 401);
    }

    const session = await initSession(user._id);

    const date = session.createdAt;
    date.setDate(date.getDate() + 3); // + 3 days

    res.json({
      authToken: session.token,
      expiresIn: date,
    });

  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
