const Promise = require("bluebird"),
    path = require('path')

module.exports = (app) => {
    const {basket, basket_status, goods, goods_basket} = app.models

    this.addToBasket = async (req, res, next) => {
        const {id} = req.params
        const {count} = req.query

        if (id && count) {
            const good = await goods.findOne({
                where: {
                    id
                }
            })

            if (good) {
                let cur_basket

                cur_basket = await basket.findOne({
                    where: {
                        user_id: req.user_id,
                        status: 1
                    },
                    include: [goods_basket]
                })

                if (!cur_basket) {
                    cur_basket = await basket.create({
                        user_id: req.user_id
                    })
                }

                let gb

                gb = await goods_basket.findOne({
                    where: {
                        basket_id: cur_basket.id,
                        good_id: good.id
                    }
                })

                if (!gb) {
                    if (count > 0) {
                        await goods_basket.create({
                            basket_id: cur_basket.id,
                            good_id: good.id,
                            count: count
                        })
                    }
                } else {
                    if (count <= 0) {
                        await gb.destroy()
                    }
                }

                cur_basket = await basket.findOne({
                    where: {
                        id: cur_basket.id
                    },
                    include: [goods_basket, basket_status, {
                        model: goods_basket,
                        include: goods
                    }]
                })

                res
                    .status(200)
                    .send({
                        success: true,
                        data: {
                            id: cur_basket.id,
                            goods: cur_basket.goods_baskets,
                            status: cur_basket.basket_status,
                            created: cur_basket.date_added,
                            modified: cur_basket.date_modified
                        }
                    })
            } else {
                res
                    .status(404)
                    .send({
                        success: false,
                        error: {
                            text: 'Good don\'t founded',
                            errored: [
                                'id'
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
                            ...!id ? ['id'] : [],
                            ...!count ? ['count'] : []
                        ]
                    }
                })
        }

    }

    this.getAll = async (req, res, next) => {
        const basket_list = await basket.findAll({
            where: {
                user_id: req.user_id
            },
            include: [goods_basket, basket_status, {
                model: goods_basket,
                include: goods
            }]
        })

        res
            .status(200)
            .send({
                success: true,
                data: {
                    basket_list
                }
            })

    }

    this.update = async (req, res, next) => {
        const {id} = req?.params
        const {status} = req.query

        const changeStatus = async (status) => {
            await exist.update({
                status: status
            })

            let b = await basket.findOne({
                where: {
                    id: id
                },
                include: [goods_basket, basket_status, {
                    model: goods_basket,
                    include: goods
                }]
            })

            res
                .status(200)
                .send({
                    success: true,
                    data: {
                        basket: b
                    }
                })
        }

        const exist = await basket.findOne({
            where: {
                id: id
            }
        })

        if (exist && status) {
            const exist_status = await basket_status.findOne({
                where: {
                    id: status
                }
            })

            if (exist_status) {
                if (status == 2 || status == 4) {
                    await changeStatus(status)
                } else if (req.is_admin) {
                    await changeStatus(status)
                } else {
                    res
                        .status(403)
                        .send({
                            success: false,
                            error: {
                                text: 'Not allowed',
                                errored: [
                                    'status'
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
                            text: 'Not found or status',
                            errored: [
                                'status'
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
                        text: 'Not found or status incorrect',
                        errored: [
                            ...(!id ? ['id'] : []),
                            ...(!status ? ['status'] : [])
                        ]
                    }
                })
        }
    }

    this.deleteBasket = async (req, res, next) => {
        const {id} = req.params

        const exist = await basket.findOne({
            where: {
                id: id,
                user_id: req.user_id
            }
        })

        if (exist) {
            const exist_gb = await goods_basket.findAll({
                where: {
                    basket_id: id,
                }
            })

            for (let i = 0; i < exist_gb.length; i++) {
                const gb = exist_gb[i]
                await gb.destroy()
            }

            await exist.destroy()

            const basket_list = await basket.findAll({
                where: {
                    user_id: req.user_id
                },
                include: [goods_basket, basket_status, {
                    model: goods_basket,
                    include: goods
                }]
            })

            res
                .status(200)
                .send({
                    success: true,
                    basket_list
                })
        } else {
            res
                .status(404)
                .send({
                    success: false,
                    error: {
                        text: 'Not found',
                        errored: [
                            'id'
                        ]
                    }
                })
        }
    }

    return this
}