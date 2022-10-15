const {DataTypes, Model} = require("sequelize")
const path = require("path");

module.exports = (app) => {
    /**
     * Sequelize
     */
    const sequelize = app.system.sequelize

    /**
     * Models
     */
    class goods extends Model {}

    /**
     * Init
     */
    goods.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.STRING
        },
        date_added: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        timestamps: true,
        tableName: 'goods',
        modelName: 'goods',
        createdAt: 'date_added',
    })

    /**
     * Associate
     */
    goods.associate = (models) => {
        goods.hasMany(models.goods_basket, {
            sourceKey: 'id',
            foreignKey: 'good_id'
        })

        goods.belongsTo(models.users, {
            sourceKey: 'id',
            foreignKey: 'user_id'
        })
    }

    /**
     * Return
     */
    return goods
}