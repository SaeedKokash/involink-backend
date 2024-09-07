// module.exports = (sequelize, DataTypes) => {
//     const Permission = sequelize.define('Permission', {
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       description: {
//         type: DataTypes.STRING,
//       },
//     });
  
//     // Permission.associate = (models) => {
//     //   Permission.belongsToMany(models.User, { through: 'UserPermissions' });
//     // };
  
//     return Permission;
//   };
  