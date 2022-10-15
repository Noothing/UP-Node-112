const jwt = require("jsonwebtoken");
const {el} = require("date-fns/locale");
const {validateAccessToken} = require("../utils/jwt");
module.exports = function (app) {
    const {users, user_token} = app.models

    this.checkAuth = async (req, res, next) => {
        const {_access_token} = req.cookies

        if (_access_token) {
            const token = await user_token.findOne({
                where: {
                    access_token: _access_token
                }
            })

            if (token) {
                const exist = await validateAccessToken(_access_token)
                if (exist) {
                    req.user_id = exist.user_id
                } else {
                    token.destroy()
                }
            }
        }

        next()
    }

    this.requireAuth = async (req, res, next) => {
        if (req.user_id) {
            next()
        } else {
            res
                .status(403)
                .send({
                    success: false,
                    error: {
                        text: 'You need to be authed'
                    }
                })
        }
    }

    this.determineRole = async (req, res, next) => {
        const {user_id} = req

        if (user_id) {
            const user = await users.findOne({
                where: {id: user_id}
            })

            req.is_admin = user.role_id == 2
        }

        next()
    }

    this.requiredAdminRole = async (req, res, next) => {
        const {is_admin} = req

        if (is_admin){
            next()
        }else{
            res
                .status(405)
                .send({
                    success: false,
                    error: 'Not allowed'
                })
        }
    }

    return this
}