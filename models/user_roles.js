const {DataTypes, Model} = require("sequelize")

module.exports = (app) => {
    /**
     * Sequelize
     */
    const sequelize = app.system.sequelize

    /**
     * Models
     */
    class user_roles extends Model {}

    /**
     * Init
     */
    user_roles.init({
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
        tableName: 'user_roles',
        modelName: 'user_roles',
        createdAt: 'date_added',
    })

    /**
     * Associate
     */
    user_roles.associate = (models) => {
        user_roles.hasMany(models.users, {
            sourceKey: 'id',
            foreignKey: 'role_id'
        })
    }

    /**
     * Return
     */
    return user_roles
}