const User = require('../models/user');
const { isTokenValid } = require('../helpers/jwt');
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new AuthorizationError('Необходима авторизация');
  }
  let payload;
  try {
    payload = isTokenValid(token);
    User.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          throw new AuthorizationError('Необходима авторизация');
        }
        req.user = { _id: user._id };
        next();
      })
      .catch(next);
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }
};
