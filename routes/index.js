const router = require('express').Router();
const routerUser = require('./user');
const routerMovie = require('./movie');
const { login, createUser, signout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { validationSignInData, validationSignUpData } = require('../middlewares/validations');

router.post('/signin', validationSignInData, login);
router.post('/signup', validationSignUpData, createUser);
router.get('/signout', signout);
// авторизация
router.use(auth);
router.use('/', routerUser);
router.use('/', routerMovie);
router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
module.exports = router;
