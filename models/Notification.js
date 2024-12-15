// models/Notification.js

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'notification_types',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    notifiable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contacts', // Assuming notifications are for Contacts
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Data payload for the notification',
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when the notification was read',
    },
    status: {
      type: DataTypes.ENUM('unread', 'read', 'archived'),
      allowNull: false,
      defaultValue: 'unread',
      validate: {
        isIn: [['unread', 'read', 'archived']],
      },
      comment: 'Status of the notification',
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.NotificationType, { foreignKey: 'type_id', as: 'NotificationType' });
    Notification.belongsTo(models.Contact, { foreignKey: 'notifiable_id', as: 'Contact' });
  };

  return Notification;
};
