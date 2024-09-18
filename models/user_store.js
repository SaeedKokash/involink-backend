'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserStore = sequelize.define('UserStore', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: true,
        paranoid: true,
        // underscored: true,
    });

    UserStore.associate = function (models) {
        UserStore.belongsTo(models.User, { foreignKey: 'user_id' });
        UserStore.belongsTo(models.Store, { foreignKey: 'store_id' });
      };
      
    return UserStore;
}