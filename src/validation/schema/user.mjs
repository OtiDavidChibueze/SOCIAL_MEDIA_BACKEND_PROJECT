// USER SCHEMA VALIDATION
import joi from "joi";

// SIGNUP SCHEMA VALIDATION
const signUp = joi.object(
  {
    username: joi.string().min(3).max(20).required().messages({ 'string.empty': 'please enter your username' }),
    email: joi.string().email().required().lowercase().messages({ 'string.empty': 'please enter your email' }),
    password: joi.string().min(6).required().messages({ 'string.empty': 'please enter your password' }),
    followers: joi.array(),
    followersCounts: joi.number().default(0).min(0),
    following: joi.array(),
    followingCounts: joi.number().default(0).min(0),
    phone_number: joi.string().regex(/^0[0-9]{10}$/).required().messages({ 'string.empty': 'please enter your phone_number' }),
    profile_pics: joi.string(),
    cover_pics: joi.string(),
    isAdmin: joi.boolean().default(false),
    isSuperAdmin: joi.boolean().default(false),
    posts: joi.array(),
    desc: joi.string().max(50),
    city: joi.string().max(50),
    from: joi.string().max(50),
    relationship: joi.string().valid("single",
      "married",
      "divorced",
      "complicated",
      "engaged",
      "in a relationship").default('single'),
    passwordResetToken: joi.string(),
    passwordResetTokenExpiresAt: joi.date(),
    passwordChangedAt: joi.date(),
  })

// UPDATE SCHEMA VALIDATION
const updateUser = joi.object(
  {
    username: joi.string().min(3).max(20),
    phone_number: joi.string()
      .regex(/^0[0-9]{10}$/)
      .max(11).message({ 'string.empty': 'field is not allowed to be empty' }),
    profile_pics: joi.string(),
    cover_pics: joi.string(),
    desc: joi.string().max(50),
    city: joi.string().max(50),
    from: joi.string().max(50),
    relationship: joi.string().valid("single",
      "married",
      "divorced",
      "complicated",
      "engaged",
      "in a relationship").default('single'),
  })


const newPassword = joi.object({
  oldPassword: joi.string().required(),
  newPassword: joi.string().required().min(6).message({ 'string.empty': 'please enter your new password' }),
})

const forgottenPassword = joi.object({
  email: joi.string().email().required()
})

export { signUp, updateUser, newPassword, forgottenPassword };
