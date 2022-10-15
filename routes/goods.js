module.exports = (app) => {
    /**
     * Express
     */
    const api = app.system.express.connection

    /**
     * Controllers
     */
    const {addGood, updateGood, deleteGood, getGood, getAllGoods} = app.controllers.goods

    const {checkAuth, determineRole, requiredAdminRole} = app.middleware.authorization;

    /**
     * Routes
     */
    api.get('/goods/all', getAllGoods)
    api.get('/goods/:id', getGood)
    api.post('/goods/', checkAuth, determineRole, requiredAdminRole, addGood)
    api.patch('/goods/:id', checkAuth, determineRole, requiredAdminRole, updateGood)
    api.delete('/goods/:id', checkAuth, determineRole, requiredAdminRole, deleteGood)
}