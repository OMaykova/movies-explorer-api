const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.getMovie = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new NotFoundError('Сохраненных пользователем фильмов нет'))
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, id,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image: image.url,
    trailer: trailerLink,
    nameRU,
    nameEN,
    thumbnail: image.formats.thumbnail.url,
    movieId: id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании фильма');
      } else {
        next(err);
      }
    })
    .catch(next);
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findByIdAndRemove(req.params._id)
    .orFail(new NotFoundError('Фильм с указанным _id не найден'))
    .then(() => {
      res.status(200).send({ message: 'Фильм удален!' });
    })
    .catch(next);
};
