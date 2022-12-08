const { string } = require('joi');
const Joi = require('joi');

module.exports.positionSchema = Joi.object({
    position: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        image: Joi.string().required()
    }).required()
});

module.exports.submissionSchema = Joi.object({
    submission: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        subType: Joi.string().valid('Choke', 'Break', 'Pain').required()
    }).required()
});