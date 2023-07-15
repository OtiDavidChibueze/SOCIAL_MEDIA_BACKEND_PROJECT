//* POST SCHEMA VALIDATION
import joi from "joi";

export const postValidation = joi.object({
  userId: joi.string().regex(/^[a-fA-F0-9]{24}$/),
  desc: joi.string().required().max(500),
  img: joi.string().optional(),
  video: joi.string().optional(),
  like: joi.number().default(0),
  dislike: joi.number().default(0),
  liked: joi.array().default([]),
  disliked: joi.array().default([]),
  comments: joi.array().items(
    joi.object({
      commentedBy: joi.string().required().regex(/^[a-fA-F0-9]{24}$/),
      comment: joi.string().required().max(500),
    })
  ),
});

export const updatePost = joi.object({
  desc: joi.string().required().max(500),
  img: joi.string().optional(),
  video: joi.string().optional(),

});
