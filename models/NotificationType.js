// models/NotificationType.js

module.exports = (sequelize, DataTypes) => {
  const NotificationType = sequelize.define('NotificationType', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
      comment: 'Type of notification, e.g., "email", "sms", "whatsapp"',
    },
  }, {
    tableName: 'notification_types',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'deleted_at'],
        name: 'notification_types_name_deleted_at_unique',
      },
    ],
  });

  NotificationType.associate = (models) => {
    NotificationType.hasMany(models.Notification, { foreignKey: 'type_id', as: 'Notifications' });
  };

  return NotificationType;
};
