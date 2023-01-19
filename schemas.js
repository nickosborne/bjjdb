const Joi = require('joi');

module.exports.positionSchema = Joi.object({
    position: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        image: Joi.string().required(),
        userId: Joi.string(),
        approved: Joi.boolean()
    }).required()
});

module.exports.editSchema = Joi.object({
    edit: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string(),
        image: Joi.string().required()
    })
})
module.exports.submissionSchema = Joi.object({
    submission: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        subType: Joi.string().valid('Choke', 'Break', 'Pain').required(),
        edited: Joi.boolean().required()
    }).required()
});

module.exports.submissionVariationSchema = Joi.object({
    variation: Joi.object({
        name: Joi.string().required(),
        position: Joi.string().required(),
        submission: Joi.string().required(),
        video: Joi.string().required(),
    }).required()
})