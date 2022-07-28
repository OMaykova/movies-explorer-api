const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const SALT_ROUND = 10;
const { generateToken } = require('../helpers/jwt');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const MongoDuplicateError = require('../errors/mongo-duplicate-err');
const AuthorizationError = require('../errors/auth-err');

module.exports.getProfileUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    const {
      name, email, password,
    } = req.body;
    bcrypt
      .hash(password, SALT_ROUND)
      .then((hash) => User.create({
        name, email, password: hash,
      }))
      .then((user) => res.status(200).send({
        name: user.name, email: user.email,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          throw new MongoDuplicateError(MongoDuplicateError.message);
        }
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные при создании пользователя');
        } else {
          next(err);
        }
      })
      .catch(next);
  } else {
    throw new BadRequestError('Некорректно указан Email');
  }
};
module.exports.login = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = generateToken({ _id: user._id });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, // срок куки 7 дней
          httpOnly: true,
          sameSite: 'none',
          secure: 'true',
        });
        res.send({ message: 'Проверка прошла успешно!' });
      })
      .catch(() => {
        throw new AuthorizationError(AuthorizationError.message);
      })
      .catch(next);
  }
  throw new BadRequestError('Некорректно указан Email');
};

module.exports.signout = (req, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Cookie удален' });
};
