const mongoose = require('mongoose');

// 스키마 설정
const partnerSchema = mongoose.Schema({
  partnerCode: String,    // 협력사 코드(PK)
  partnerName: String,    // 협력사명
  companyName: String     // 회사이름
});

// Find All Partner
partnerSchema.statics.findAll =  () => {
  return this.find({});
};

// Find Category
partnerSchema.statics.findByPartnerCode =  (partnerCode) => {
  return this.find({ partnerCode });
};

// Insert Category
partnerSchema.statics.create =  (payload) => {
  const category = new this(payload);
  return category.save();
};

// Update Category
partnerSchema.statics.update =  (payload) => {
  return this.updateOne({ partnerCode: payload.partnerCode }, { $set: payload });
};

// Delete Category
partnerSchema.statics.delete =  (partnerCode) => {
  return this.remove({ partnerCode });
};

module.exports = mongoose.model('Partner', partnerSchema, 'TB_PARTNER_INFO');