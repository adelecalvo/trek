const jwt = require('jsonwebtoken');

const sessionController = {};

sessionController.startSession = (req, res, next) => {
  // grab user name on request
  // turn it into a jwt and store on cookie
  // 1. create token (key + secret + expiration)
  // 2. set cookie and store jwt secret / token
  const { username } = req.body;
  const token = jwt.sign(
    {
      // session expires in an hour
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: username,
    },
    'secret',
  );

  res.cookie('ssid', token, { httpOnly: true });
  req.locals = { jwt: token };
  next();
};

sessionController.isLoggedIn = async (req, res, next) => {
  req;
  // jwt.verify(token, 'secret');
};

module.exports = sessionController;
