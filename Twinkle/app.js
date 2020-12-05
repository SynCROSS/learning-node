const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const cookieParser = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/cookie-parser');
const morgan = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/morgan');
const path = require('path');
const session = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express-session');
const nunjucks = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/nunjucks');
const passport = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/passport');

require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/dotenv').config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post.js');
const userRouter = require('./routes/user.js');
const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 3000);
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

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

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

module.exports = app;
