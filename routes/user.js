const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser, getProfileUser,
} = require('../controllers/user');

router.get('/users/me', getProfileUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);

module.exports = router;
