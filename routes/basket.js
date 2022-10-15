module.exports = (app) => {
    /**
     * Express
     */
    const api = app.system.express.connection

    /**
     * Controllers
     */
    const {addToBasket, getAll, update, deleteBasket} = app.controllers.basket
    const {checkAuth, requireAuth, determineRole, requiredAdminRole} = app.middleware.authorization;

    /**
     * Routes
     */
    api.get('/basket/', checkAuth, requireAuth, getAll)
    api.post('/basket/:id', checkAuth, requireAuth, addToBasket)
    api.put('/basket/:id', checkAuth, requireAuth, determineRole, update)
    api.delete('/basket/:id', checkAuth, requireAuth, deleteBasket)
}