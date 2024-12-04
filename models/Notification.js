// models/Notification.js

module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      type_id: DataTypes.INTEGER,
      notifiable_id: DataTypes.INTEGER,
      data: DataTypes.STRING,
      read_at: DataTypes.DATE,
    }, {
      tableName: 'tags',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    Notification.associate = (models) => {
      Notification.belongsTo(models.NotificationType, { foreignKey: 'type_id' });
    };
  
    return Notification;
  };
  