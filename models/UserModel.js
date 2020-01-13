     
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs'); // 암호화를 위한 모듈
    
// 스키마 설정
const userSchema = mongoose.Schema({
  name : String,
  email : String,
  password : String
});
    
// hash 생성
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// 값 비교
userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(bcrypt.hashSync(password), this.password);
};

//비밀번호 비교
userSchema.methods.comparePassword = (password,dbPassword, cb) => {
  bcrypt.compare(password, dbPassword , (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);