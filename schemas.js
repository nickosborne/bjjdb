const Joi = require('joi');

module.exports.positionSchema = Joi.object({
    position: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        image: Joi.string().required(),
        userId: Joi.string(),
        public: Joi.boolean()
    }).required()
});

module.exports.techniqueSchema = Joi.object({
    technique: Joi.object({
        name: Joi.string().required(),
        otherNames: Joi.string().allow(''),
        position: Joi.string().required(),
        video: Joi.string().required(),
        side: Joi.string().valid('Top', 'Bottom').required(),
        group: Joi.string().required(),
        type: Joi.string().valid('Pass',
            'Sweep',
            'Submission',
            'Takedown',
            'Escape',
            'Backtake').required(),
        userId: Joi.string().required()
    }).required()
})
