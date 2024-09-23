// models/Tax.js

module.exports = (sequelize, DataTypes) => {
    const Tax = sequelize.define('Tax', {
      store_id: { type: DataTypes.INTEGER, allowNull: false },
      name: DataTypes.STRING,
      rate: DataTypes.DOUBLE,
      type: DataTypes.STRING,
      enabled: DataTypes.BOOLEAN,
    }, {
      tableName: 'taxes',
      timestamps: true,
      paranoid: true,
      underscored: true,
    });
  
    Tax.associate = (models) => {
      Tax.belongsTo(models.Store, { foreignKey: 'store_id' });
      Tax.hasMany(models.Item, { foreignKey: 'tax_id' });
    };
  
    return Tax;
  };
  