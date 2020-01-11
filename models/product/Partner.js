const mongoose = require('mongoose');

// 스키마 설정
const partnerSchema = mongoose.Schema({
    partnerCode: String,
    partnerName: String,
    companyName: String
});

// Find All Partner
  partnerSchema.statics.findAll = function () {
    return this.find({});
  };
  
  // Find Category
  partnerSchema.statics.findByPartnerCode = function (partnerCode) {
    return this.find({ partnerCode });
  };
  
  // insert Category
  partnerSchema.statics.create = function (payload) {
    const category = new this(payload);
    return category.save();
  };
  
  // update Category
  partnerSchema.statics.update = function (payload) {
    return this.updateOne({ partnerCode: payload.partnerCode }, { $set: payload });
  };
  
  // delete Category
  partnerSchema.statics.delete = function (partnerCode) {
    return this.remove({ partnerCode });
  };
  
  module.exports = mongoose.model('Partner', partnerSchema, 'TB_PARTNER_INFO');