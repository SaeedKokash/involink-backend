// models/UserMedia.js

module.exports = (sequelize, DataTypes) => {
  const UserMedia = sequelize.define('UserMedia', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
    media_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'media',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },

    tag: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Tag for categorizing the media, e.g., "profile_pic", "banner"',
    },
    media_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Order of the media in the user\'s media list',
    },
  }, {
    tableName: 'user_media',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'media_id'],
        name: 'user_media_user_id_media_id_unique',
      },
    ],
  });

  UserMedia.associate = (models) => {
    UserMedia.belongsTo(models.User, { foreignKey: 'user_id', as: 'User' });
    UserMedia.belongsTo(models.Media, { foreignKey: 'media_id', as: 'Media' });
  };

  return UserMedia;
};
