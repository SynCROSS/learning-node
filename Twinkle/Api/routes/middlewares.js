const jwt = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/jsonwebtoken');
const RateLimit = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('Login is Required');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("You're Logged In.");
    res.redirect(`/?error=${message}`);
  }
};
exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: 'Page Expired Because Token has expired.',
      });
    }
    return res.status(401).json({
      code: 401,
      message: 'Unauthorized Because Token is Not Valid.',
    });
  }
};

exports.apiLimiter = new RateLimit({
  windowMs: 60 * 100,
  max: 10,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // * Default Value is 429(TOO Many Requests)
      message: 'You Can Only Request 10 Times per Minutes.',
    });
  },
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410, // * Gone
    message: 'You Can Update the App. Do You Wanna Update?',
  });
};
