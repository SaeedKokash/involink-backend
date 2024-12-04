// models/TaggedEntity.js

module.exports = (sequelize, DataTypes) => {
    const TaggedEntity = sequelize.define('TaggedEntity', {
      tag_id: { type: DataTypes.INTEGER, primaryKey: true },
      entity_id: { type: DataTypes.INTEGER, primaryKey: true },
      entity_type: { type: DataTypes.STRING, primaryKey: true },
    }, {
      tableName: 'tagged_entities',
      paranoid: true,
      underscored: true,
    });
  
    TaggedEntity.associate = (models) => {
      TaggedEntity.belongsTo(models.Tag, { foreignKey: 'tag_id' });
    };
  
    return TaggedEntity;
  };

  // what is this for??