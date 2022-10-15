const crypto = require("crypto"),
    Promise = require("bluebird"),
    path = require('path')

module.exports = (app) => {
    const {users, goods} = app.models

    const dirname = path.join(__dirname, "..", "uploads");

    this.addGood = async (req, res, next) => {
        const {name, description, price} = req.body

        const {image} = req?.files ?? {}

        try {
            if (name && description && price) {
                const new_good = await goods.create({
                    name: name,
                    description: description,
                    price: price,
                    user_id: req.user_id
                })

                if (image) {
                    let image_path = path.join(dirname, `${Date.now()}-${req.files.image.name}`)
                    await image.mv(image_path)
                    await new_good.update({
                        image: `${Date.now()}-${req.files.image.name}`
                    })
                }

                res
                    .status(200)
                    .send({
                        success: true,
                        data: {
                            new_good
                        }
                    })
            } else {
                res
                    .status(401)
                    .send({
                        success: false,
                        error: {
                            text: 'Not all required fields exist',
                            errored: [
                                ...!name ? ['name'] : [],
                                ...!description ? ['description'] : [],
                                ...!price ? ['price'] : []
                            ]
                        }
                    })
            }

        } catch (e) {
            console.log('[ADD GOOD]', e)
            res
                .status(500)
                .send({
                    success: false,
                    error: 'Internal server error'
                })
        }

    }

    this.getGood = async (req, res, next) => {
        const {id} = req.params

        if (id) {
            try {
                const good = await goods.findOne({
                    where: {
                        id: id
                    }
                })

                if (good) {
                    res
                        .status(200)
                        .send({
                            success: true,
                            data: {
                                name: good.name,
                                description: good.description,
                                image: good.image,
                                price: good.price
                            }
                        })
                } else {
                    res
                        .status(404)
                        .send({
                            success: false,
                            error: 'Good has not founded'
                        })
                }
            } catch (e) {
                console.log('[GET GOOD]', e)
                res
                    .status(500)
                    .send({
                        success: false,
                        error: 'Internal server error'
                    })
            }
        } else {
            res
                .status(404)
                .send({
                    success: false,
                    error: 'Good has not founded'
                })
        }
    }

    this.getAllGoods = async (req, res, next) => {
        try {
            const goods_list = await goods.findAll({})

            res
                .status(200)
                .send({
                    success: true,
                    data: {
                        goods_list
                    }
                })
        } catch (e) {
            console.log('[GET ALL GOODS]', e)
        }
    }

    this.updateGood = async (req, res, next) => {
        const {id} = req.params
        const {name, description, price} = req.body
        const {image} = req?.files ?? {}

        if (id) {
            const good = await goods.findOne({
                where: {
                    id: id
                }
            })

            if (good) {
                let image_name = null
                if (image) {
                    image_name = `${Date.now()}-${req.files.image.name}`
                    let image_path = path.join(dirname, image_name)
                    await image.mv(image_path)
                }

                await good.update({
                    ...(name && {name: name}),
                    ...(description && {description: description}),
                    ...(price && {price: price}),
                    ...(image_name && {image: image_name})
                })

                res
                    .status(200)
                    .send({
                        success: true,
                        data: [
                            good
                        ]
                    })
            } else {
                res
                    .status(404)
                    .send({
                        success: false,
                        error: {
                            'text': 'Good don\'t founded'
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
                            ...!id ? ['id'] : []
                        ]
                    }
                })
        }
    }

    this.deleteGood = async (req, res, next) => {
        const {id} = req.params

        if (id) {
            const good = await goods.findOne({
                where: {
                    id
                }
            })

            if (good) {
                good.destroy()

                res
                    .status(200)
                    .send({
                        success: true
                    })
            } else {
                res
                    .status(404)
                    .send({
                        success: false,
                        error: {
                            'text': 'Good don\'t founded'
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
                            ...!id ? ['id'] : []
                        ]
                    }
                })
        }
    }

    return this
}