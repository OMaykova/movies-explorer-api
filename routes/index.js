const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const routerUser = require('./user');
const routerMovie = require('./movie');
const { login, createUser, signout } = require('../controllers/user');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), createUser);
router.get('/signout', signout);
// авторизация
router.use(auth);
router.use('/', routerUser);
router.use('/', routerMovie);
router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
module.exports = router;
