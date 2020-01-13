const mongoose = require('mongoose');

// 스키마 설정
const categorySchema = mongoose.Schema({
  categoryCode: String,         // 카테고리 코드(PK)
  parentCategoryCode: String,   // 협력사 상품 코드 명
  categoryName: String,         // 카테고리명
  depth: String                 // 카테고리 깊이
});

// Find All Category
categorySchema.statics.findAll = () => {
  return this.find({});
};

// Find Category
categorySchema.statics.findByCategoryCode = (categoryCode) => {
  return this.find({ categoryCode });
};

// Insert Category
categorySchema.statics.create = (payload) => {
  const category = new this(payload);
  return category.save();
};

// Update Category
categorySchema.statics.update = (payload) => {
  return this.updateOne({ categoryCode: payload.categoryCode }, { $set: payload });
};

// Delete Category
categorySchema.statics.delete = (categoryCode) => {
  return this.remove({ categoryCode });
};

module.exports = mongoose.model('Category', categorySchema, 'TB_CATEGORY');