// models/Tag.js

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
      comment: 'Name of the tag, e.g., "Urgent", "New Arrival"',
    },
  }, {
    tableName: 'tags',
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'deleted_at'],
        name: 'tags_name_deleted_at_unique',
      },
    ],
  });

  Tag.associate = (models) => {
    Tag.hasMany(models.TaggedEntity, { foreignKey: 'tag_id', as: 'TaggedEntities' });
  };

  return Tag;
};
