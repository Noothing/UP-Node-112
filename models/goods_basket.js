const {DataTypes, Model} = require("sequelize")

module.exports = (app) => {
    /**
     * Sequelize
     */
    const sequelize = app.system.sequelize

    /**
     * Models
     */
    class goods_basket extends Model {
    }

    /**
     * Init
     */
    goods_basket.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        basket_id: {
            type: DataTypes.INTEGER
        },
        good_id: {
            type: DataTypes.INTEGER
        },
        count: {
            type: DataTypes.INTEGER
        },
        date_added: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        timestamps: true,
        tableName: 'goods_basket',
        modelName: 'goods_basket',
        createdAt: 'date_added'
    })

    /**
     * Associate
     */
    goods_basket.associate = (models) => {
        goods_basket.belongsTo(models.basket, {
            sourceKey: 'id',
            foreignKey: 'basket_id'
        })

        goods_basket.belongsTo(models.goods, {
            sourceKey: 'id',
            foreignKey: 'good_id'
        })
    }

    /**
     * Return
     */
    return goods_basket
}