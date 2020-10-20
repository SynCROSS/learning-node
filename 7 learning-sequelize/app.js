const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const path = require('path');
const morgan = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/morgan');
const nunjucks = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/nunjucks');

const { sequelize } = require('./models');
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express();
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} Router Ain't Exist`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.locals.message = error.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log('Server is Waiting on Port', app.get('port'));
});
