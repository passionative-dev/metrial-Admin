"use strict";
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define(
    "Country",
    {
      title: DataTypes.STRING,
      parent: DataTypes.INTEGER,
    },
    {}
  );
  Country.associate = function (models) {
    // associations can be defined here
  };
  return Country;
};
