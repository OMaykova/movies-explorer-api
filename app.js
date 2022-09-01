const express = require('express');

const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { MONGO_URL } = require('./config');

const allowedCors = {
  origin: [
    'https://api.filmoteka.nomoredomains.xyz',
    'http://api.filmoteka.nomoredomains.xyz',
    'https://filmoteka.nomoredomains.xyz',
    'http://filmoteka.nomoredomains.xyz',
    'http://localhost:3000',
    'http://localhost:3001',
    'https://omaykova.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});
app.use('*', cors(allowedCors));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);
