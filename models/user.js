const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Введите адрес электронной почты'],
    unique: true,
    validate: {
      validator(v) {
        return /^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(v);
      },
      message: 'Неправильный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Введите пароль'],
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // теперь user доступен
        });
    });
};
module.exports = mongoose.model('user', userSchema);
