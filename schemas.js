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

module.exports.submissionSchema = Joi.object({
    submission: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        userId: Joi.string(),
        subType: Joi.string().valid('Choke', 'Break', 'Pain').required()
    }).required()
});

module.exports.submissionVariationSchema = Joi.object({
    variation: Joi.object({
        name: Joi.string().required(),
        position: Joi.string().required(),
        submission: Joi.string().required(),
        video: Joi.string().required(),
        side: Joi.string().valid('Top', 'Bottom').required(),
    }).required()
})

module.exports.techniqueSchema = Joi.object({
    technique: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        position: Joi.string().required(),
        video: Joi.string().required(),
        side: Joi.string().valid('Top', 'Bottom').required(),
        type: Joi.string().valid('Pass',
            'Sweep',
            'Submission',
            'Takedown',
            'Escape',
            'Backtake').required()
    }).required()
})