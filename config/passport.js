const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy; 
const User = require('../models/UserModel'); 
require('dotenv').config();

   
module.exports = (passport) => { // index.js에서 넘겨준 passport입니다.
  let opts = {};
  opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = process.env.JWT_SECRET;

   passport.serializeUser((user, done) =>{ // req.session.passport.user에 세션에 저장하는 과정입니다.
      done(null, user.id); // deserializeUser에 값을 넘겨줍니다.
    });
    passport.deserializeUser((id, done) =>{ // 세션에 저장되어있는 값을 DB와 비교하는 과정입니다.
      User.findById(id, (err, user) =>{
        done(err, user); // 이때 req.user에 저장됩니다.
      })
    });
  
  // 회원가입
  passport.use('local-signup', new LocalStrategy({ // local-signup이라는 전략을짭니다.
      usernameField: 'email', // 필드를 정해주는 것 입니다.
      passwordField: 'password',
      passReqToCallback: true  // request객체에 user의 데이터를 포함시킬지에 대한 여부를 결정
    }, (req, email, password, done) => {
      User.findOne({'email': email}, (err, user) => { // 넘겨받은 email을 통해 검색합니다.
        if (err) return done(null);
        // flash를 통해서 메세지를 넘겨줍니다.   
        if (user) return done(null, false);
             
        const newUser = new User();
        newUser.email = email; // 넘겨받은 정보들을 세팅합니다.
        newUser.password = newUser.generateHash(password); // generateHash을 통해 비밀번호를 hash화 합니다.
        newUser.name = req.body.name;
  
        newUser.save(function (err) { // 저장합니다.
          if (err) throw err;
          return done(null, newUser); // serializeUser에 값을 넘겨줍니다.
        });
      })
    }));

  // 로그인 
  passport.use('local-signin', new LocalStrategy({ // local-signin 라는 전략을짭니다.
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // 인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
  }, (req, email, password, done) => {
    User.findOne({'email': email }, (err, user) => {
      try {
        if (err) return done(err);
        if (!user) { 
            //return done(null, false, req.flash('signinMessage', '아이디가 존재하지 않습니다.'));
            return done(null, false);
        } else {  
          user.comparePassword(password, user.password, (err, isMatch) => {
            if (isMatch && !err) {
              return done(null, user);
            } else {
              // return done(err, false, req.flash('signinMessage', '아이디가 존재하지 않습니다.'));
              return done(null, false);
            }
          });
        }
      } catch(err) {
        console.log(err);
        done(err);
      }     
    });
  }));     

  passport.use('jwt', new JWTStrategy(
    opts, (jwt_payload, done) => {
      try {
        User.findOne({
            email: jwt_payload.email,
        }).then(user => {
          if (user) {
            console.log('user found in db in passport');
            done(null, user);
          } else {
            console.log('user not found in db');
            done(null, user);
          }
        });
      } catch (err) {
        console.log(err);
        done(err);
      }
    })); 
};  