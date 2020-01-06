const mongoose = require('mongoose');

// 스키마 설정
const categorySchema = mongoose.Schema({
    categoryCode: String,
    parentCategoryCode: String,
    categoryName: String,
    depth: String
});


// Find All
categorySchema.statics.findAll = function () {
  return this.find({});
};

// Find All
categorySchema.statics.findByCategoryCode = function (categoryCode) {
  return this.find({ categoryCode });
};

module.exports = mongoose.model('Category', categorySchema, 'TB_CATEGORY');