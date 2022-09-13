"use strict";
module.exports = (sequelize, DataTypes) => {
  const UploadFile = sequelize.define(
    "UploadFile",
    {
      directory: DataTypes.STRING,
      filename: DataTypes.STRING,
      catId: DataTypes.STRING,
      param1: DataTypes.STRING,
      param2: DataTypes.STRING,
      param3: DataTypes.STRING,
      param4: DataTypes.STRING,
      param5: DataTypes.STRING,
      param6: DataTypes.STRING,
      param7: DataTypes.STRING,
    },
    {}
  );
  UploadFile.associate = function (models) {
    // associations can be defined here
  };
  return UploadFile;
};
