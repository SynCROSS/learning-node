const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const passport = require('passport');

require('dotenv').config();

const v1 = require('./routes/v1');
const v2 = require('./routes/v2');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 3125);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database Connection Successful!');
  })
  .catch(error => {
    console.error(error);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { httpOnly: true, secure: false },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/v1', v1);
app.use('/v2', v2);

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

const port = process.env.PORT || 3125;
app.listen(port, () => {
  console.log('Server is Waiting on Port', port);
});
