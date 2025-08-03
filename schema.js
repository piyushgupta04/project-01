const Joi = require('joi')

const joi_listingSchema = Joi.object({
     obj : Joi.object({
        title: Joi.string().required(),
        desc: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow('')
     }).required()
})


const joi_reviewSchema = Joi.object({
   review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      comment: Joi.string().required()
   }).required()
})

module.exports = {joi_reviewSchema, joi_listingSchema}