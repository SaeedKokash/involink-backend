// models/NotificationType.js

module.exports = (sequelize, DataTypes) => {
    const NotificationType = sequelize.define('NotificationType', {
      name: DataTypes.STRING,
    }, {
      tableName: 'notification_types',
      paranoid: true,
      underscored: true,
    });
  
    NotificationType.associate = (models) => {
      NotificationType.hasMany(models.Notification, { foreignKey: 'type_id' });
    };
  
    return NotificationType;
  };
  