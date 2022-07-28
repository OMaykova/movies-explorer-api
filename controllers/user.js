const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const SALT_ROUND = 10;

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
