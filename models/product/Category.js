const mongoose = require('mongoose');

let _this;

// 스키마 설정
const categorySchema = mongoose.Schema({
  categoryCode: String,         // 카테고리 코드(PK)
  parentCategoryCode: String,   // 협력사 상품 코드 명
  categoryName: String,         // 카테고리명
  depth: String                 // 카테고리 깊이
});

// Find All Category
categorySchema.statics.findAll = () => {
  return _this.find({});
};

// Find Category
categorySchema.statics.findByCategoryCode = (categoryCode) => {
  return _this.find({ categoryCode });
};

// Insert Category
categorySchema.statics.create = (payload) => {
  const category = new _this(payload);
  return category.save();
};

// Update Category
categorySchema.statics.update = (payload) => {
  return _this.updateOne({ categoryCode: payload.categoryCode }, { $set: payload });
};

// Delete Category
categorySchema.statics.delete = (categoryCode) => {
  return _this.remove({ categoryCode });
};
_this = mongoose.model('Category', categorySchema, 'TB_CATEGORY');

module.exports = _this; 