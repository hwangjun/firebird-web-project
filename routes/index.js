const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// 로그인
router.get('/sign', (req, res, next) => {
  res.render('sign',{ title: 'sign in', link: 'sign', message : req.flash('signinMessage')})
});


router.post('/sign', passport.authenticate('local-signin',{
  successRedirect : '/login_suc',
  failureRedirect : '/sign',
  failureFlash : true
}));


//회원가입
router.get('/signup',(req, res, next) =>  {
  res.render('sign',{ title: 'sign up', link: 'signup', message : req.flash('signupMessage')})
});


//회원가입
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/login_suc',
  failureRedirect : '/signup',
  failureFlash : true
}));

router.get('/login_suc', (req, res, next) => {
  if(req.user) {
    const { email, password } = req.user;

    const token = jwt.sign(req.user.toJSON(),  'jwt-secret', {
                  expiresIn: 604800 // 1 week
                });
             // return the information including token as JSON
    res.render('login_suc', {title: 'login_suc', email , password, token});
    //res.json({ success: true, token: 'JWT ' + token });
  } else {
    res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
  }
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//전체 사용자 확인
router.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  const token = getToken(req.headers);
  if(token) {
      const user = req.user;
      res.json({ success : true, user});
  } else { 
    res.status(401).send({ success: false, msg: 'Authentication failed'});
  }
});


getToken = (headers) => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};




module.exports = router;
