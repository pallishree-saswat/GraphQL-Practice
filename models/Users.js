module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "user-list",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
    },
    {
      createdAt: "create_at",
      updatedAt: "modified_at",
    }
  );

  return Users;
};
