import Joi from "joi";
import { nameValidation, passwordValidation } from "./userFieldValidators.js";

const id = Joi.string().hex().length(24).required();

export const updateNameSchema = {
  params: Joi.object({
    id,
  }),
  body: Joi.object({
    name: nameValidation,
  }),
};

export const replaceUserSchema = {
  params: Joi.object({
    id,
  }),
  body: Joi.object({
    name: nameValidation,
    age: Joi.number().integer().min(10).max(80).required(),
    email: Joi.string().trim().lowercase().email().required(),
    address: Joi.string().trim().min(5).max(300).required(),
    password: passwordValidation,
  }),
};

export const deleteUserSchema = {
  params: Joi.object({
    id,
  }),
};
