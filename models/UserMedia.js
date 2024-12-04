// models/UserMedia.js

module.exports = (sequelize, DataTypes) => {
    const UserMedia = sequelize.define('UserMedia', {
      user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
      media_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },

      tag: DataTypes.STRING, // what is the tag for?
      media_order: DataTypes.INTEGER, // what is the media_order for?

    }, {
      tableName: 'user_media',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });

    // user_media is a many to many relation with user and media

    UserMedia.associate = (models) => {
      UserMedia.belongsTo(models.User, { foreignKey: 'user_id' });
      UserMedia.belongsTo(models.Media, { foreignKey: 'media_id' });
    }
      
    return UserMedia;
  };
  