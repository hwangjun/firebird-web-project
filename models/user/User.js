     
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt-nodejs'); // 암호화를 위한 모듈
import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";


/**
 *  9999 : Admin
 *  0000 : Unauthenticated user 
 *  1111 : Authenticated user
 *  2222 : Partner
 */



// 스키마 설정
const userSchema = mongoose.Schema({
  name :  {          // 이름
    type: String,
    match: [/^.{4,12}$/, 'Should be 4-12 characters!'],
    trim: true,
  },     
  email : {          // 이메일(PK)
    type: String,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Should be a vaild email address!'],
    trim: true
  },    
  password : {      // 비밀번호
    type:String,
    required:[true,'Password is required!'],
    //select:false
  },
  role: {
    roleCode  : {
      type : String,
      default : '0000'
      
    },
    roleName : {           
      type : String,
      default : 'Unauthenticated'
    }  
  },
},{
    toObject:{virtuals:false}
    
});


// virtuals
userSchema.virtual('passwordConfirmation')
  .get(function() { return this._passwordConfirmation; })
  .set(function(value) { this._passwordConfirmation = value; });

userSchema.virtual('originalPassword')
  .get(function() { return this._originalPassword; })
  .set(function(value) { this._originalPassword = value; });

userSchema.virtual('currentPassword')
  .get(function() { return this._currentPassword; })
  .set(function(value) { this._currentPassword = value; });

userSchema.virtual('newPassword')
  .get(function() { return this._newPassword; })
  .set(function(value) { this._newPassword = value; });


// password validation
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
const passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
userSchema.path('password').validate(function (v) {
  let user = this;
  // create user
  if (user.isNew) {
    if (!user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation is required!');
    }
    if (!passwordRegex.test(user.password)) {
      user.invalidate('password', passwordRegexErrorMessage);
    } else if (user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
  // update user  관리자의 경우 무조건 수정가능하나 아닌경우 같은 계정만 수정가능하게 변경 예정
  if (!user.isNew) {
    if (!user.currentPassword) {
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    if (user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)) {
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }
    if (user.newPassword && !passwordRegex.test(user.newPassword)) {
      user.invalidate('newPassword', passwordRegexErrorMessage);
    } else if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});



// Find All User
userSchema.statics.findAll = function() {
  return this.find({});
};

// Find one User
userSchema.statics.findByUserEamil = function(email) {
  return this.find({ email });
};

// Insert User
userSchema.statics.create = function(payload){
  const user = new this(payload);
  return user.save();
};

// Update User
userSchema.statics.update = function(payload) {
  const { email, name } = payload;
  const password = userSchema.statics.generateHash(payload.password);
  return this.updateOne({ email }, { $set: {password, name}});
};

// Delete User
userSchema.statics.delete = function(email) {
  return this.remove({ email });
};

// hash 생성
userSchema.statics.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//비밀번호 비교
userSchema.statics.comparePassword = function(password, dbPassword, cb) {
  bcrypt.compare(password, dbPassword , (err, isMatch) => {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

userSchema.pre('save', function (next) {  //es6 arrow function not working
  let user = this;
  if (!user.isModified('password')) {
    return next();
  } else {
    user.password = userSchema.statics.generateHash(user.password);
    return next();
  }
});

// userSchema.pre('updateOne', function (next) {
//   let user = this;
//   user.options.runValidators = true;
//   next();
// })


// module.exports = mongoose.model('User', userSchema, 'TB_USER');
export default mongoose.model('User', userSchema, 'TB_USER');
