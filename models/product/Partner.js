const mongoose = require('mongoose');

let _this;

// 스키마 설정
const partnerSchema = mongoose.Schema({
  partnerCode: {
    type: String,
    require: true,
    uppercase: true,
    trim: true
  },
  partnerName: {
    type: String,
    require: true,
    trim: true
  }
});

// Find All Partner
partnerSchema.statics.findAll = () => {
  return _this.find({});
};

// Find Category
partnerSchema.statics.findByPartnerCode = (partnerCode) => {
  return _this.find({ partnerCode });
};

// Insert Category
partnerSchema.statics.create = (payload) => {
  const category = new _this(payload);
  return category.save();
};

// Update Category
partnerSchema.statics.update = (payload) => {
  return _this.updateOne({ partnerCode: payload.partnerCode }, { $set: payload });
};

// Delete Category
partnerSchema.statics.delete = (partnerCode) => {
  return _this.remove({ partnerCode });
};
_this = mongoose.model('Partner', partnerSchema, 'TB_PARTNER');
module.exports = _this;