module.exports = function (sequelize, DataTypes) {
  const extra_field = sequelize.define(
    "ExtraField",
    {
      name: DataTypes.STRING(255),
      alias: { type: DataTypes.STRING(255), allowNull: true },
      published: DataTypes.BOOLEAN,
      type: DataTypes.INTEGER,
      required: DataTypes.BOOLEAN,
      allowNull: DataTypes.BOOLEAN,
      defaultValues: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      timestamps: true,
    }
  );

  extra_field.associate = (db) => {
    db.ExtraField.belongsTo(db.Category);
  };

  return extra_field;
};
