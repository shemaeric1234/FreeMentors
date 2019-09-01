import Joi from '@hapi/joi';

const userSignup = Joi.object().keys({

  firstName: Joi.string().alphanum().min(3).max(30)
    .required(),
  lastName: Joi.string().alphanum().min(3).max(30)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required(),
  address: Joi.string().required(),
  bio: Joi.string().min(3).min(3).max(500)
    .required(),
  occupation: Joi.string().min(3).max(300).required(),
  expertise: Joi.string().min(3).max(300).required(),
});

const userSignin = Joi.object().keys({
  email: Joi.string().email({ minDomainSegments: 2 }),
  password: Joi.string().required(),

});

const sessionReviewSchema = Joi.object().keys({
  score: Joi.number().required(),
  remark: Joi.string()
    .required(),
});

const sessionsSchema = Joi.object().keys({

  mentorId: Joi.number().integer().required(),
  questions: Joi.string().required(),
});

export {
  userSignup, userSignin, sessionReviewSchema, sessionsSchema,
};
