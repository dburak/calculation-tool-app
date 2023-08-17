const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const tokenExtractor = (request, response, next) => {
  const authorization = request.headers.authorization;
  console.log(authorization);
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
    next();
  } else {
    response.status(401).json({ error: 'Unauthorized' });
  }
};

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  request.user = decodedToken;

  next();
};

module.exports = { tokenExtractor, userExtractor };
