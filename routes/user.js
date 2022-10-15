module.exports = (app) => {
    /**
     * Express
     */
    const api = app.system.express.connection

    /**
     * Controllers
     */
    const {registration, authorization} = app.controllers.user

    /**
     * Routes
     */
    api.post('/user/registration', registration)
    api.post('/user/auth', authorization)
}