const router = require('express').Router();
const {
  updateUser, getProfileUser,
} = require('../controllers/user');
const { validationUserData } = require('../middlewares/validations');

router.get('/users/me', getProfileUser);
router.patch('/users/me', validationUserData, updateUser);

module.exports = router;
