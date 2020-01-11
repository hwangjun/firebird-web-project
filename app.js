const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const morgan = require('morgan'); 
const session = require('express-session');
const helmet = require('helmet');
const flash = require('connect-flash');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');

const connect = require('./schemas');
const app = express();
connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  cooke: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(flash());

//app.set('jwt-secret', config.secret);

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use(cors());


app.use('/', indexRouter);
app.use('/api/auth',authRouter);
app.use('/api/users', usersRouter);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
