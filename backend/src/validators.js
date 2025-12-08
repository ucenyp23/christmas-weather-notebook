import Joi from "joi";
export const noteSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().min(1).max(100).required(),
  location: Joi.string().min(1).max(100).required(),
  datetime: Joi.string().isoDate().required(),
  temp: Joi.number().required(),
  unit: Joi.string().valid("C", "F").required(),
  wind_kph: Joi.number().min(0).optional(),
  precip_mm: Joi.number().min(0).optional()
});
export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).max(128).required()
});
export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
