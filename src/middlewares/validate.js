import { httpError } from "./errorHandler.js";

const options = {
  abortEarly: false,
  stripUnknown: true,
  convert: true,
};

export const validate = (schema) => (req, res, next) => {
  const value = {};

  for (const key of ["body", "params", "query"]) {
    if (!schema[key]) {
      continue;
    }

    const result = schema[key].validate(req[key], options);
    if (result.error) {
      return next(
        httpError(`Validation failed: ${result.error.details.map((detail) => detail.message).join(", ")}`, 400),
      );
    }
    value[key] = result.value;
  }

  if (value.body) req.body = value.body;
  if (value.params) Object.assign(req.params, value.params);
  if (value.query) Object.assign(req.query, value.query);

  next();
};
