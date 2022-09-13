"use strict";
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      title: DataTypes.STRING,
      parent: DataTypes.INTEGER,
    },
    {}
  );
  Category.associate = function (models) {
    models.Category.hasMany(models.ExtraField);
  };
  return Category;
};
