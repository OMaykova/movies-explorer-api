const User = require('../models/user');
const { isTokenValid } = require('../helpers/jwt');
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorizationError(AuthorizationError.message);
  }
  let payload;
  try {
    payload = isTokenValid(token);
    User.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          throw new AuthorizationError(AuthorizationError.message);
        }
        req.user = { _id: user._id };
        next();
      })
      .catch(next);
  } catch (err) {
    next(new AuthorizationError(AuthorizationError.message));
  }
};
