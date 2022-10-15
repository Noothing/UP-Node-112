const {DataTypes, Model} = require("sequelize")

module.exports = (app) => {
    /**
     * Sequelize
     */
    const sequelize = app.system.sequelize

    /**
     * Models
     */
    class basket extends Model {
    }

    /**
     * Init
     */
    basket.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        date_added: {
            type: DataTypes.DATE
        },
        date_modified: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        timestamps: true,
        tableName: 'basket',
        modelName: 'basket',
        createdAt: 'date_added',
        updatedAt: 'date_modified'
    })

    /**
     * Associate
     */
    basket.associate = (models) => {
        basket.hasMany(models.users, {
            sourceKey: 'id',
            foreignKey: 'user_id'
        })

        basket.belongsTo(models.basket_status, {
            sourceKey: 'id',
            foreignKey: 'status'
        })

        basket.hasMany(models.goods_basket, {
            sourceKey: 'id',
            foreignKey: 'basket_id'
        })
    }

    /**
     * Return
     */
    return basket
}