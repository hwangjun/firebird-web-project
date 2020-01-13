const mongoose = require('mongoose');

// 스키마 설정
const categorySchema = mongoose.Schema({
    categoryCode: String,
    parentCategoryCode: String,
    categoryName: String,
    depth: String
});

// Find All Category
categorySchema.statics.findAll = function () {
  return this.find({});
};

// Find Category
categorySchema.statics.findByCategoryCode = function (categoryCode) {
  return this.find({ categoryCode });
};

// insert Category
categorySchema.statics.create = function (payload) {
  const category = new this(payload);
  return category.save();
};

// update Category
categorySchema.statics.update = function (payload) {
  return this.updateOne({ categoryCode: payload.categoryCode }, { $set: payload });
};

// delete Category
categorySchema.statics.delete = function (categoryCode) {
  return this.remove({ categoryCode });
};

module.exports = mongoose.model('Category', categorySchema, 'TB_CATEGORY');