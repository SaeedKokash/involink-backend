// models/Tag.js

module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag', {
      name: DataTypes.STRING,
    }, {
      tableName: 'tags',
      paranoid: true,
      underscored: true,
    });
  
    Tag.associate = (models) => {
      Tag.hasMany(models.TaggedEntity, { foreignKey: 'tag_id' });
    };
  
    return Tag;
  };
  