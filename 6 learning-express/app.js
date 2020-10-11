const express = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express');
const morgan = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/morgan');
const cookieParser = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/cookie-parser');
const session = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/express-session');
const dotenv = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/dotenv');
const path = require('path');
const nunjucks = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/nunjucks');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
nunjucks.configure('views', { express: app, watch: true });

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { httpOnly: true, secure: false },
    name: 'session-cookie',
  }),
);

app.use('/', indexRouter);
app.use('/user', userRouter);

/* app.use((req, res, next) => {
  res.status(404).send('Not Found');
}); */

/* const multer = require('C:/Users/kuuha/AppData/Local/Yarn/Data/global/node_modules/multer');
const fs = require('fs');
try {
  fs.readFileSync('uploads');
} catch (e) {
  console.error('The Folder does not Exist, So It is Created.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post(
  '/upload',
  upload.fields([{ name: 'image1' }, { name: 'image2' }]),
  (req, res) => {
    console.log(req.files, req.body);
    res.send('ok');
  },
);

app.use((req, res, next) => {
  console.log('Executed on All Request.');
  next();
});
app.get(
  '/',
  (req, res, next) => {
    console.log('Executed Only on Get / Requests.');
    next();
  },
  (req, res) => {
    throw new Error('Errors are Handled by Middleware for Errors.');
  },
); */

/* app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send(error.message);
}); */
/* app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
  // res.send('Hello, Express');
}); */

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} Router is NOT Exists!`);
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
  console.log('Server is Running on Port', app.get('port'));
});
