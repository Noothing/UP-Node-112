const {DataTypes, Model} = require("sequelize")

module.exports = (app) => {
    /**
     * Sequelize
     */
    const sequelize = app.system.sequelize

    /**
     * Models
     */
    class basket_status extends Model {}

    /**
     * Init
     */
    basket_status.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        date_added: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        timestamps: true,
        tableName: 'basket_status',
        modelName: 'basket_status',
        createdAt: 'date_added'
    })

    /**
     * Associate
     */
    basket_status.associate = (models) => {
        basket_status.hasMany(models.basket, {
            sourceKey: 'id',
            foreignKey: 'status'
        })
    }

    /**
     * Return
     */
    return basket_status
}