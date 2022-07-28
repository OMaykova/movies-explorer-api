const { celebrate, Joi } = require('celebrate');

const validationMovieBody = () => {
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().min(4).max(4).required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
      trailer: Joi.string().required().pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
      movieId: Joi.number().required(),
    }),
  });
};
const validationMovieId = () => {
  celebrate({
    params: Joi.object().keys({
      _id: Joi.number().required(),
    }),
  });
};
const validationUserData = () => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
    }),
  });
};
const validationSignInData = () => {
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(3),
    }),
  });
};
const validationSignUpnData = () => {
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(3),
    }),
  });
};
module.exports = {
  validationMovieBody,
  validationMovieId,
  validationUserData,
  validationSignInData,
  validationSignUpnData,
};
