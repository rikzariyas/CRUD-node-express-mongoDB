import Joi from "joi";
import { nameValidation, passwordValidation } from "./userFieldValidators.js";

export const registerValidation = {
  body: Joi.object({
    name: nameValidation,

    email: Joi.string().trim().lowercase().email().required().messages({
      "string.email": "Invalid email format",
    }),

    address: Joi.string().trim().min(5).max(300).optional().messages({
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters long",
    }),

    password: passwordValidation,

    age: Joi.number().integer().min(10).max(80).optional().messages({
      "number.base": "Age must be a number",
      "number.integer": "Age must be a whole number",
      "number.min": "Age must be at least 10",
      "number.max": "Age cannot exceed 80",
    }),
  }),
};

export const loginValidation = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  }),
};

export const adminLoginValidation = {
  body: Joi.object({
    username: Joi.string().trim().lowercase().required(),
    password: Joi.string().required(),
  }),
};
