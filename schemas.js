const Joi = require('joi');

module.exports.positionSchema = Joi.object({
    position: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string(),
        image: Joi.string().required()
    }).required()
});

module.exports.subSchema = Joi.object({
    submission: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string(),
        subType: Joi.string().valid('Choke', 'Break', 'Pain').required()
    }).required()
});