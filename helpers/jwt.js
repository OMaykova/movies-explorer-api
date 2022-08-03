const jwt = require('jsonwebtoken');

require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

const isTokenValid = (token) => jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
module.exports = { generateToken, isTokenValid };
