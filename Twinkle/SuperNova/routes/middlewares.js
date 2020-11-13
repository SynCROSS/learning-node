const jwt = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/jsonwebtoken');
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
