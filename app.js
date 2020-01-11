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
//require('dotenv').config();
const dotenv = require('dotenv');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const prodRouter = require('./routes/api/prod');

const connect = require('./schemas');
const app = express();


/**
 * NODE_ENV 설정
 * windows : set NODE_ENV=local 확인: echo %NODE_ENV%
 * linux(MAC) : export NODE_ENV=local 확인 : echo $NODE_ENV
 */
let envPath = '';
switch(process.env.NODE_ENV) {
  case 'local':
    envPath = './local.env';
    break;
  case 'dev':
    envPath = './dev.env';
    break;
  case 'production':
    envPath = './production.env';
    break;
  default: 
    envPath = './local.env';
}
dotenv.config({path: envPath});

// SWAGGER
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerOption = require('./config/swagger-jsdoc');
const swaggerSpec = swaggerJSDoc(swaggerOption);
const swaggerUi = require('swagger-ui-express');


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

//인터셉터 역할 부여   
app.use(function (req, res, next) {
  // next(createError(403));
  next();
});

// ROUTERS
app.use('/', indexRouter);
app.use('/api/auth',authRouter);
app.use('/api/users', usersRouter);
app.use('/products', prodRouter);
app.use('/api/category', require('./routes/api/category'));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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