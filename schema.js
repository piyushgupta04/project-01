const Joi = require('joi')

const listingObject = Joi.object({
     obj : Joi.object({
        title: Joi.string().required(),
        desc: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string()
     }).required()
})

module.exports = listingObject;