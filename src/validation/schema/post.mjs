// POST SCHEMA VALIDATION
import joi from "joi";

export const postValidation = joi.object(
  {
    userId: joi.string().regex(/^[a-fA-F0-9]{24}$/),
    desc: joi.string().max(50).required(),
    img: joi.string(),
    like: joi.array(),
    dislike: joi.array(),
    liked: joi.array(),
    disliked: joi.array(),
    // comments: joi.array().options(
    //   joi.object({
    //     commentedBy: joi
    //       .string()
    //       .regex(/^[a-fA-F0-9]{24}$/)
    //       .required(),
    //     comment: joi.string().max(50).required(),
    //   })
    // ),
  },
  { stripUnknown: true }
);
