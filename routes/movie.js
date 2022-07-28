const router = require('express').Router();
const {
  validationMovieBody,
  validationMovieId,
} = require('../middlewares/validations');
const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movie');

router.get('/movies', getMovie);
router.post('/movies', validationMovieBody, createMovie);
router.delete('/movies/:_id', validationMovieId, deleteMovie);

module.exports = router;
