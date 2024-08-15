const Joi = require('joi');


const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country:Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().allow("", null)
    }).required()
});



const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required()
        
    }).required()
});

module.exports = { listingSchema, reviewSchema };
