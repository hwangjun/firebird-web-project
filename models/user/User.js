     
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs'); // 암호화를 위한 모듈
    
// 스키마 설정
const userSchema = mongoose.Schema({
  name : String,     // 이름
  email : String,    // 이메일(PK)
  password : String  // 비밀번호
});

// Find All User
userSchema.statics.findAll = () => {
  console.log('this', this);
  return this.find({});
};

// Find one User
userSchema.statics.findByUserEamil = (email) => {
  return this.find({ email });
};

// Insert User
userSchema.statics.create = (payload) => {
  const user = new this(payload);
  return user.save();
};

// Update User
userSchema.statics.update = (payload) => {
  return this.updateOne({ email: payload.emal }, { $set: payload });
};

// Delete User
userSchema.statics.delete = (email) => {
  return this.remove({ email });
};

// hash 생성
userSchema.statics.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//비밀번호 비교
userSchema.statics.comparePassword = (password, dbPassword, cb) => {
  bcrypt.compare(password, dbPassword , (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema, 'TB_USER');