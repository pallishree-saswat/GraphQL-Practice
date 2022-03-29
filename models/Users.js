
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "user",
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      hasKey: DataTypes.BOOLEAN,
    },
    {
      createdAt: "create_at",
      updatedAt: "modified_at",
    }
  );

  return Users;
};
