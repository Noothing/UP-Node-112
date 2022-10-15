const crypto = require("crypto"),
    {argon2i} = require("argon2-ffi"),
    Promise = require("bluebird"),
    randomBytes = Promise.promisify(crypto.randomBytes)

module.exports = (app) => {
    const jwt_config = app.config.jwt;
    const {users, user_token} = app.models

    this.registration = async (req, res, next) => {
        const {email, username, password, firstname, lastname} = req.body
        try {
            if (email && username && password && firstname && lastname) {
                let salt = await randomBytes(32)
                let encrypted_password = await argon2i.hash(password, salt)

                const exist = await users.findOne({
                    where: {
                        username
                    }
                })

                if (!exist) {
                    const user = await users.create({
                        email,
                        username,
                        password: encrypted_password,
                        firstname,
                        lastname
                    })

                    const access = await user_token.create({
                        user_id: user.id,
                        access_token: user.getAccessToken()
                    })

                    res
                        .status(200)
                        .cookie('_access_token', access.access_token, {maxAge: jwt_config.access_expires, httpOnly: true})
                        .send({
                            success: true,
                            data: {
                                email: user.email,
                                username: user.username,
                                fullName: user.fullName,
                            }
                        })
                }else{
                    res
                        .status(401)
                        .send({
                            success: false,
                            error: {
                                text: 'Username is exist',
                                errored: [
                                    'username'
                                ]
                            }
                        })
                }
            } else {
                res
                    .status(401)
                    .send({
                        success: false,
                        error: {
                            text: 'Not all required fields exist',
                            errored: [
                                ...!email ? ['email'] : [],
                                ...!username ? ['username'] : [],
                                ...!password ? ['password'] : [],
                                ...!firstname ? ['firstname'] : [],
                                ...!lastname ? ['lastname'] : [],
                            ]
                        }
                    })
            }
        } catch (e) {
            console.warn("[REGISTRATION]", e)
            res
                .status(500)
                .send({
                    success: false,
                    error: 'Internal server error'
                });
        }
    }

    this.authorization = async (req, res, next) => {
        const {username, password} = req.body
        try {
            if (username && password) {
                const user = await users.findOne({
                    where: {
                        username
                    }
                })

                if (user) {
                    const verify = await user.verifyPassword(password)

                    if (verify) {
                        const token = user.getAccessToken()

                        const access = await user_token.create({
                            user_id: user.id,
                            access_token: token,
                        })

                        res.status(200)
                            .cookie('_access_token', token, {maxAge: jwt_config.access_expires, httpOnly: true})
                            .send({
                                success: true
                            })

                    } else {
                        res
                            .status(403)
                            .send({
                                success: false,
                                error: {
                                    text: 'Invalid username or password',
                                    errored: [
                                        'username',
                                        'password'
                                    ]
                                }
                            })
                    }
                } else {
                    res
                        .status(404)
                        .send({
                            success: false,
                            error: {
                                text: 'Account not fount',
                                errored: [
                                    'username',
                                    'password'
                                ]
                            }
                        })
                }
            } else {
                res.status(400).send({
                    success: false,
                    error: 'Invalid input data'
                })
            }

        } catch (e) {
            console.log("[Authorization]", e)
            res.status(500).send({
                success: false,
                error: "Internal server error"
            })
        }
    }
    return this
}