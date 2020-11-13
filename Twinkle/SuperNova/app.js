const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const cookieParser = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/cookie-parser');
const morgan = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/morgan');
const path = require('path');
const session = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express-session');
const nunjucks = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/nunjucks');
const passport = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/passport');

require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/dotenv').config();

const indexRouter = require('./routes');

const app = express();
app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { httpOnly: true, secure: false },
  }),
);

app.use('/', indexRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.error} ${req.url} Router Ain't Exist.`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('Server is Waiting on Port', port);
});
