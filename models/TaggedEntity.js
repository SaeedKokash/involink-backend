// models/TaggedEntity.js

module.exports = (sequelize, DataTypes) => {
  const TaggedEntity = sequelize.define('TaggedEntity', {
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      primaryKey: true,
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        isIn: [['Contact', 'Invoice', 'Item', 'User']], // Add all possible entity types
      },
      comment: 'Type of the entity being tagged, e.g., "Contact", "Invoice"',
    },
  }, {
    tableName: 'tagged_entities',
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['tag_id', 'entity_id', 'entity_type'],
        name: 'tagged_entities_tag_id_entity_id_entity_type_unique',
      },
    ],
  });

  TaggedEntity.associate = (models) => {
    TaggedEntity.belongsTo(models.Tag, { foreignKey: 'tag_id', as: 'Tag' });

    // Polymorphic association: Depending on entity_type, it belongs to different models
    // This requires additional handling in your application logic
    // Sequelize doesn't support polymorphic associations out of the box
  };

  return TaggedEntity;
};
