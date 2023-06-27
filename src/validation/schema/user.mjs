// USER SCHEMA VALIDATION
import joi from "joi";

// SIGNUP SCHEMA VALIDATION
const signUp = joi.object(
  {
    username: joi.string().min(3).max(20).required(),
    email: joi.string().email().required().lowercase(),
    password: joi.string().min(6).required(),
    followers: joi.array(),
    following: joi.array(),
    phone_number: joi.number().max(11).required(),
    profile_pics: joi.string(),
    cover_pics: joi.string(),
    // role: joi.string().options(
    //   joi.object({
    //     enum: joi.array(),
    //   })
    // ),
    posts: joi.array(),
    desc: joi.string().max(50),
    city: joi.string().max(50),
    from: joi.string().max(50),
    // relationship: joi.string().options(
    //   joi.object({
    //     enum: joi.array(),
    //   })
    // ),
    passwordResetToken: joi.string(),
    passwordResetTokenExpiresAt: joi.date(),
    passwordChangedAt: joi.date(),
  },
  { stripUnknown: true }
);

// UPDATE SCHEMA VALIDATION
const updateUser = joi.object(
  {
    username: joi.string().min(3).max(20).required(),
    phone_number: joi
      .number()
      // .regex(/^0[0-9]{10}$/)
      .max(11)
      .required(),
    profile_pics: joi.string(),
    cover_pics: joi.string(),
    desc: joi.string().max(50),
    city: joi.string().max(50),
    from: joi.string().max(50),
    // relationship: joi.string().options(
    //   joi.object({
    //     enum: joi.array(),
    //   })
    // ),
  },
  { stripUnknown: true }
);

export { signUp, updateUser };
