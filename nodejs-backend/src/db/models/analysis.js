"use strict";
module.exports = (sequelize, DataTypes) => {
  const Analysis = sequelize.define(
    "Analysis",
    {
      parameter: DataTypes.STRING,
      filename: DataTypes.STRING,
      catId: DataTypes.STRING,
      output1: DataTypes.STRING,
      output2: DataTypes.STRING,
      output3: DataTypes.STRING,
      output4: DataTypes.STRING,
      output5: DataTypes.STRING,
      output6: DataTypes.STRING,
      output7: DataTypes.STRING,
    },
    {}
  );
  Analysis.associate = function (models) {
    // associations can be defined here
  };
  return Analysis;
};
