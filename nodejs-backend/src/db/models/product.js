"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      title: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      description_1: DataTypes.STRING,

      cat_1: DataTypes.INTEGER,
      cat_2: DataTypes.INTEGER,
      cat_3: DataTypes.INTEGER,

      country: DataTypes.INTEGER,
      state: DataTypes.INTEGER,

      brand: DataTypes.INTEGER,
      available: DataTypes.BOOLEAN,
      date_published: DataTypes.STRING,
      price: DataTypes.STRING,

      description_2: DataTypes.STRING,
      discount: DataTypes.STRING,
      code: DataTypes.STRING,
      rating: DataTypes.STRING,
      hashtag: DataTypes.STRING,

      extraValues: DataTypes.JSON,
    },
    {}
  );
  Product.associate = function (models) {};
  return Product;
};
